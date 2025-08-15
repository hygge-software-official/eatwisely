import express from 'express';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { get_encoding } from 'tiktoken';
import getSecretValue from '../utils/secrets.js';
import { saveToDynamoDB, calculateCost } from './llm/helpers.js';
import { modelMap, defaultParams } from './llm/config.js';
import { errorHandlerSentry } from '../utils/errorHandlerSentry.js';
import {
  invokeLlamaModel,
  invokeOpenAiModel,
  invokeClaudeModel,
  invokeOpenAiAssistant,
} from './llm/modelInvokers.js';

const isDev = process.env.NODE_ENV === 'development';

dotenv.config();

const router = express.Router();

/**
 * Initializes AWS Bedrock and OpenAI clients.
 * @returns {Promise<{bedrockClient: BedrockRuntimeClient, openai: OpenAI}>}
 */
const initClients = async () => {
  const secrets = await getSecretValue();
  const bedrockClient = new BedrockRuntimeClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: secrets.AWS_ACCESS_KEY_ID_INNER ?? '',
      secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY_INNER ?? '',
    },
  });
  const openai = new OpenAI({
    apiKey: isDev ? secrets.OPENAI_API_DEV_KEY : secrets.OPENAI_API_PROD_KEY,
    timeout: 25000,
  });
  return { bedrockClient, openai };
};

const { bedrockClient, openai } = await initClients();

/**
 * Counts tokens in the given text using GPT-2 encoding.
 * @param {string} text - The text to count tokens for.
 * @returns {number} The number of tokens.
 */
const countTokens = (text) => {
  const encoder = get_encoding('gpt2');
  return encoder.encode(text).length;
};

/**
 * Prepares parameters for LLM invocation based on the model and query parameters.
 * @param {string} model - The model name.
 * @param {string} modelId - The model ID.
 * @param {Object} queryParams - The query parameters.
 * @returns {Object} The prepared parameters.
 */
const prepareParams = (model, modelId, queryParams) => {
  const defaults = defaultParams[model] || defaultParams.default;
  let params = {};

  switch (model) {
    case 'llama3-8b':
      params = {
        max_gen_len: parseInt(queryParams.max_gen_len || defaults.max_gen_len, 10),
        temperature: parseFloat(queryParams.temperature || defaults.temperature),
        top_p: parseFloat(queryParams.top_p || defaults.top_p),
      };
      break;
    case 'claude':
      params = {
        max_tokens: parseInt(queryParams.max_tokens || defaults.max_tokens, 10),
        temperature: parseFloat(queryParams.temperature || defaults.temperature),
        top_p: parseFloat(queryParams.top_p || defaults.top_p),
        anthropic_version: queryParams.anthropic_version || 'bedrock-2023-05-31',
      };
      break;
    case 'gpt-assistant':
      params = {
        assistantId: queryParams.assistant_id,
        model: modelId,
        maxCompletionTokens: parseInt(queryParams.max_completion_tokens || defaults.max_completion_tokens, 10),
        maxPromptTokens: parseInt(queryParams.max_prompt_tokens || defaults.max_prompt_tokens, 10),
        temperature: parseFloat(queryParams.temperature || defaults.temperature),
        role: queryParams.role || defaults.role,
      };
      break;
    default:
      params = {
        model: modelId,
        max_tokens: parseInt(queryParams.max_tokens || defaults.max_tokens || defaults.max_gen_len, 10),
        temperature: parseFloat(queryParams.temperature || defaults.temperature),
        top_p: parseFloat(queryParams.top_p || defaults.top_p),
      };
  }

  return params;
};

/**
 * Invokes the appropriate LLM based on the model.
 * @param {string} model - The model name.
 * @param {string} modelId - The model ID.
 * @param {string} prompt - The input prompt.
 * @param {Object} params - The invocation parameters.
 * @returns {Promise<Object>} The LLM response with additional metadata.
 */
const invokeLLM = async (model, modelId, prompt, params) => {
  const startTime = Date.now();
  let llmResponse;

  switch (true) {
    case model === 'llama3-8b':
      llmResponse = await invokeLlamaModel(bedrockClient, modelId, prompt, params);
      break;
    case model.startsWith('gpt') && model !== 'gpt-assistant':
      llmResponse = await invokeOpenAiModel(openai, prompt, params);
      break;
    case model === 'gpt-assistant':
      llmResponse = await invokeOpenAiAssistant(openai, prompt, params);
      break;
    case model.startsWith('claude'):
      llmResponse = await invokeClaudeModel(bedrockClient, modelId, prompt, params);
      break;
    default:
      throw new Error(`Unsupported model: ${model}`);
  }

  const endTime = Date.now();
  const executionTime = endTime - startTime;

  const inputTokens = llmResponse.inputTokens || countTokens(prompt);
  const outputTokens = llmResponse.outputTokens || countTokens(llmResponse.generation);
  const totalTokens = llmResponse.tokenCount || inputTokens + outputTokens;

  const { inputCost, outputCost, totalCost } = calculateCost(model, inputTokens, outputTokens);

  return {
    response: llmResponse.generation,
    inputTokens,
    outputTokens,
    totalTokens,
    inputCost: Number(inputCost.toFixed(6)),
    outputCost: Number(outputCost.toFixed(6)),
    executionTime,
    totalCost: Number(totalCost.toFixed(6)),
  };
};

/**
 * Logs and saves the LLM invocation result to DynamoDB.
 * @param {Object} result - The LLM invocation result.
 * @param {string} model - The model name.
 * @param {string} modelId - The model ID.
 * @param {string} prompt - The input prompt.
 * @returns {Promise<void>}
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

router.post('/sandbox', express.text(), async (req, res) => {
  const { model, ...queryParams } = req.query;
  const prompt = req.body;

  if (!model || !prompt) {
    return res.status(400).json({ error: 'Model and prompt are required' });
  }

  const modelId = modelMap[model];
  console.log('modelId: ', modelId);
  if (!modelId) {
    return res.status(400).json({ error: 'Unsupported model' });
  }

  const params = prepareParams(model, modelId, queryParams);

  try {
    const result = await invokeLLM(model, modelId, prompt, params);
    await logAndSaveResult(result, model, modelId, prompt);
    res.status(200).json(result);
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to invoke LLM', 500);
  }
});

router.post('/assistants', async (req, res) => {
  try {
    const { name, instructions, model } = req.body;
    const { tool_type } = req.query;

    let tools = [];
    if (tool_type) {
      const validTools = ['code_interpreter', 'file_search', 'function'];
      if (validTools.includes(tool_type)) {
        tools.push({ type: tool_type });
      } else {
        return res.status(400).json({ error: 'Invalid tool type' });
      }
    }

    const assistant = await openai.beta.assistants.create({
      name: name,
      instructions: instructions,
      model: model || 'gpt-4o',
      tools: tools,
    });

    res.status(201).json({
      message: 'Assistant created successfully',
      assistant: {
        id: assistant.id,
        name: assistant.name,
        instructions: assistant.instructions,
        model: assistant.model,
        tools: assistant.tools,
      },
    });
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to create assistant', 500);
  }
});

router.get('/assistants', async (req, res) => {
  try {
    const assistants = await openai.beta.assistants.list({
      limit: 100,
    });

    const simplifiedAssistants = assistants.data.map((assistant) => ({
      id: assistant.id,
      name: assistant.name,
      instructions: assistant.instructions,
      model: assistant.model,
    }));

    res.status(200).json({
      message: 'Assistants retrieved successfully',
      assistants: simplifiedAssistants,
    });
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to retrieve assistants', 500);
  }
});

router.delete('/assistants/:assistantId', async (req, res) => {
  const { assistantId } = req.params;

  try {
    const deletedAssistant = await openai.beta.assistants.del(assistantId);

    res.status(200).json({
      message: 'Assistant deleted successfully',
      deletedAssistant: {
        id: deletedAssistant.id,
        object: deletedAssistant.object,
        deleted: deletedAssistant.deleted,
      },
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        error: 'Assistant not found',
        details: `No assistant found with ID ${assistantId}`,
      });
    }

    errorHandlerSentry(res, error, 'Failed to delete assistant', 500);
  }
});


export default router;