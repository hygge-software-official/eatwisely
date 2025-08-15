import * as Sentry from "@sentry/aws-serverless";
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { get_encoding } from 'tiktoken';
import getSecretValue from '../../utils/secrets.js';
import { saveToDynamoDB, calculateCost, getRecentRecipes, getRecipeByTitle, updateUserExcludeTitles } from './helpers.js';
import { modelMap, defaultParams } from './config.js';
import { generateRecipePrompt } from './prompt.js';
import { invokeOpenAiModel } from './modelInvokers.js';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { client } from '../../utils/dynamoDB.js';
import { v4 as uuidv4 } from 'uuid';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';

const isDev = process.env.NODE_ENV === 'development';

dotenv.config();

const router = express.Router();
let openai;

/**
 * Initialize OpenAI client with API key from secrets.
 * @returns {Promise<void>}
 */
const initOpenAI = async () => {
    const secrets = await getSecretValue();
    openai = new OpenAI({ apiKey: isDev ? secrets.OPENAI_API_DEV_KEY : secrets.OPENAI_API_PROD_KEY });
};

/**
 * Count the number of tokens in a given text.
 * @param {string} text - The text to count tokens for.
 * @returns {number} The number of tokens.
 */
const countTokens = (text) => {
    const encoder = get_encoding('gpt2');
    return encoder.encode(text).length;
};

/**
 * Invoke the LLM with the given model, prompt, and parameters.
 * @param {string} model - The model to use.
 * @param {string} prompt - The prompt to send to the model.
 * @param {object} params - Additional parameters for the model.
 * @returns {Promise<object>} The result from the model.
 */
const invokeLLM = async (model, prompt, params) => {
    const result = await invokeOpenAiModel(openai, prompt, { ...params, model });
    let tokenCount = result.tokenCount ?? (countTokens(prompt) + countTokens(result.generation));

    return {
        completion: result.generation,
        tokenCount: tokenCount,
    };
};

/**
 * Process the completion text by removing code block markers and trimming whitespace.
 * @param {string} completion - The completion text to process.
 * @returns {string} The processed completion text.
 */
const processCompletion = (completion) => completion.replace(/```json|```/g, '').trim();

/**
 * Parse the completion text as JSON.
 * @param {string} completion - The completion text to parse.
 * @returns {object} The parsed JSON object.
 * @throws {Error} If the completion text is not valid JSON.
 */
const parseCompletion = (completion) => {
    if (!completion.endsWith('}')) {
        Sentry.captureException('Incomplete JSON response');
        throw new Error('Incomplete JSON response');
    }
    return JSON.parse(completion);
};

/**
 * Calculate the number of tokens and the cost for the given model, prompt, and completion.
 * @param {string} model - The model used.
 * @param {string} prompt - The prompt sent to the model.
 * @param {string} completion - The completion text from the model.
 * @param {number} tokenCount - The total number of tokens.
 * @returns {object} The calculated tokens and cost.
 */
const calculateTokensAndCost = (model, prompt, completion, tokenCount) => {
    const inputTokens = countTokens(prompt);
    const outputTokens = tokenCount - inputTokens;
    const { inputCost, outputCost, totalCost } = calculateCost(model, inputTokens, outputTokens);

    return {
        inputTokens,
        outputTokens,
        inputCost: Number(inputCost.toFixed(6)),
        outputCost: Number(outputCost.toFixed(6)),
        totalCost: Number(totalCost.toFixed(6)),
    };
};

/**
 * Log and save the result to DynamoDB.
 * @param {object} result - The result to log and save.
 * @param {string} model - The model used.
 * @param {string} modelId - The model ID.
 * @param {string} prompt - The prompt sent to the model.
 */
const logAndSaveResult = async (result, model, modelId, prompt) => {
    const logEntry = {
        pk: 'LLM_LOG',
        sk: `LOG#${new Date().toISOString()}`,
        model: modelId,
        prompt,
        ...result,
        timestamp: new Date().toISOString(),
    };

    await saveToDynamoDB(logEntry);
};

/**
 * Save the generated recipe to DynamoDB.
 * @param {string} userId - The user ID.
 * @param {string} recipeId - The recipe ID.
 * @param {object} recipe - The recipe object.
 * @param {object} tokensAndCost - The tokens and cost information.
 */
const saveRecipeToDynamoDB = async (userId, recipeId, recipe, tokensAndCost) => {
    const params = {
        TableName: 'UserRecipes',
        Item: marshall({
            userId,
            recipeId,
            recipe,
            createdAt: new Date().toISOString(),
            totalCost: tokensAndCost.totalCost,
            inputTokens: tokensAndCost.inputTokens,
            outputTokens: tokensAndCost.outputTokens,
            isLiked: false,
            isSaved: false,
        }),
    };
    await client.send(new PutItemCommand(params));
};

/**
 * Get the user settings from DynamoDB.
 * @param {string} userId - The user ID.
 * @returns {Promise<object|null>} The user settings or null if not found.
 */
const getUserSettings = async (userId) => {
    const params = {
        TableName: 'UserSettings',
        Key: marshall({ userId }),
    };
    const { Item } = await client.send(new GetItemCommand(params));
    return Item ? unmarshall(Item) : null;
};

/**
 * Handle the /recipe endpoint to generate a recipe.
 */
router.post('/recipe', express.json(), async (req, res) => {
    const { parameters } = req.body;
    const { max_gen_len, userId } = req.query;

    if (!parameters || !userId) {
        return res.status(400).json({ error: 'Parameters and userId are required' });
    }

    try {
        const userSettings = await getUserSettings(userId);
        let excludeTitles = userSettings ? userSettings.excludeTitles || [] : [];

        const recentRecipes = await getRecentRecipes(userId);
        const recentTitles = recentRecipes.map(recipe => recipe.recipe?.title).filter(Boolean);
        console.log('recentTitles: ', recentTitles);

        // Combine all excluded titles
        excludeTitles = [...new Set([...excludeTitles, ...recentTitles])];

        // Limit the number of excludes to a maximum of 1000
        const MAX_EXCLUDES = 1000;
        if (excludeTitles.length > MAX_EXCLUDES) {
            excludeTitles = excludeTitles.slice(0, MAX_EXCLUDES);
        }

        console.log(`Number of excluded titles: ${excludeTitles.length}`);

        const prompt = generateRecipePrompt(parameters, excludeTitles);
        console.log(`Prompt: ${prompt}`);

        const params = { ...defaultParams['gpt-4'], max_gen_len: max_gen_len ? parseInt(max_gen_len, 10) : 512 };
        const result = await invokeLLM('gpt-4', prompt, params);
        console.log(`Completion: ${result.completion}`);

        const processedCompletion = processCompletion(result.completion);
        const parsedResponse = parseCompletion(processedCompletion);

        // Check if a recipe with this title already exists
        const existingRecipe = await getRecipeByTitle(userId, parsedResponse.title);
        if (existingRecipe) {
            return res.status(409).json({ error: 'Recipe with this title already exists', existingRecipe });
        }

        const tokensAndCost = calculateTokensAndCost('gpt-4', prompt, result.completion, result.tokenCount);

        const recipeId = uuidv4();
        const finalResult = {
            recipeId,
            response: parsedResponse,
            ...tokensAndCost,
        };

        await saveRecipeToDynamoDB(userId, recipeId, parsedResponse, tokensAndCost);
        await logAndSaveResult(finalResult, 'gpt-4', modelMap['gpt-4'], prompt);

        // Update excludeTitles with the new recipe
        excludeTitles.push(parsedResponse.title);
        await updateUserExcludeTitles(userId, excludeTitles);

        res.status(200).json(finalResult);
    } catch (error) {
        console.error('Error generating recipe:', error);
        errorHandlerSentry(res, error, 'Failed to generate recipe', 500);
    }
});

/**
 * Handle the /sandbox endpoint to generate a response using the specified model.
 */
router.post('/sandbox', express.json(), async (req, res) => {
    const { model = 'gpt-4', max_gen_len } = req.query;
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const modelId = modelMap[model] || model;
    const params = { ...defaultParams[model] || defaultParams.default, max_gen_len: max_gen_len ? parseInt(max_gen_len, 10) : 512 };

    try {
        console.log('Invoking model:', modelId);
        const result = await invokeLLM(model, prompt, params);
        console.log('LLM Result:', result);

        const tokensAndCost = calculateTokensAndCost(model, prompt, result.completion, result.tokenCount);

        const finalResult = {
            response: result.completion,
            ...tokensAndCost,
        };

        await logAndSaveResult(finalResult, model, modelId, prompt);
        res.status(200).json(finalResult);
    } catch (error) {
        errorHandlerSentry(res, error, `Failed to generate response using ${model}`, 500);
    }
});

initOpenAI().then(() => {
    console.log('OpenAI client initialized');
});

export default router;