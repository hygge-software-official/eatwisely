import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import * as Sentry from "@sentry/aws-serverless";
import { client } from "../../utils/dynamoDB.js";
import { modelMap } from './config.js';

const docClient = DynamoDBDocumentClient.from(client);

// Constants
const TABLE_NAMES = {
  RECIPE_SANDBOX: 'recipeSandbox',
  USER_RECIPES: 'UserRecipes',
  USER_SETTINGS: 'UserSettings',
};

// Token pricing moved to a separate object
const TOKEN_PRICING = {
  'llama3-8b': { input: 0.0003 / 1000, output: 0.0006 / 1000 },
  'gpt-4': { input: 0.005 / 1000, output: 0.015 / 1000 },
  'gpt-4mini': { input: 0.150 / 1000000, output: 0.600 / 1000000 },
  'gpt-4o-mini-2024-07-18': { input: 0.150 / 1000000, output: 0.600  / 1000000 },
  'gpt-4o-2024-08-06': { input: 2.5 / 1000000, output: 10 / 1000000 },
  'gpt-3.5': { input: 0.002 / 1000, output: 0.006 / 1000 },
  'claude-3': { input: 0.003 / 1000, output: 0.015 / 1000 },
  'claude-3-5': { input: 0.003 / 1000, output: 0.015 / 1000 },
  'gpt-assistant': { input: 0.005 / 1000, output: 0.015 / 1000 },
};

/**
 * Saves data to DynamoDB.
 * @param {Object} data - The data to be saved.
 * @returns {Promise<void>}
 */
export const saveToDynamoDB = async (data) => {
  const command = new PutCommand({
    TableName: TABLE_NAMES.RECIPE_SANDBOX,
    Item: data,
  });
  await docClient.send(command);
};

/**
 * Calculates the cost based on the model and token usage.
 * @param {string} model - The AI model used.
 * @param {number} inputTokens - Number of input tokens.
 * @param {number} outputTokens - Number of output tokens.
 * @returns {{inputCost: number, outputCost: number, totalCost: number}}
 */
export const calculateCost = (model, inputTokens, outputTokens) => {
  const modelId = modelMap[model];
  const modelIdPricing = TOKEN_PRICING[modelId] || TOKEN_PRICING['gpt-4'];
  const inputCost = inputTokens * modelIdPricing.input;
  const outputCost = outputTokens * modelIdPricing.output;
  return { inputCost, outputCost, totalCost: inputCost + outputCost };
};

/**
 * Retrieves recent recipes for a user within the last 24 hours.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array<{recipe: {title: string}}>>}
 * @throws {Error} If fetching recipes fails.
 */
export const getRecentRecipes = async (userId) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const params = {
    TableName: TABLE_NAMES.USER_RECIPES,
    KeyConditionExpression: 'userId = :userId',
    FilterExpression: 'createdAt >= :twentyFourHoursAgo',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':twentyFourHoursAgo': twentyFourHoursAgo,
    },
    ProjectionExpression: 'recipeId, recipe.title',
  };

  try {
    const allItems = await queryAllItems(params);
    const uniqueTitles = [...new Set(allItems.map(item => item.recipe?.title).filter(Boolean))];
    return uniqueTitles.map(title => ({ recipe: { title } }));
  } catch (error) {
    console.error('Error fetching recent recipes:', error);
    Sentry.captureException(error);
    throw new Error('Could not fetch recent recipes');
  }
};

/**
 * Retrieves a recipe by its title for a specific user.
 * @param {string} userId - The user's ID.
 * @param {string} title - The title of the recipe.
 * @returns {Promise<Object|undefined>} The recipe object or undefined if not found.
 */
export const getRecipeByTitle = async (userId, title) => {
  const params = {
    TableName: TABLE_NAMES.USER_RECIPES,
    KeyConditionExpression: 'userId = :userId',
    FilterExpression: 'recipe.title = :title',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':title': title,
    },
  };

  const result = await docClient.send(new QueryCommand(params));
  return result.Items[0];
};

/**
 * Updates the list of excluded titles for a user.
 * @param {string} userId - The user's ID.
 * @param {Array<string>} excludeTitles - List of titles to exclude.
 * @returns {Promise<void>}
 */
export const updateUserExcludeTitles = async (userId, excludeTitles) => {
  const params = {
    TableName: TABLE_NAMES.USER_SETTINGS,
    Key: { userId },
    UpdateExpression: 'SET excludeTitles = :excludeTitles',
    ExpressionAttributeValues: {
      ':excludeTitles': excludeTitles,
    },
  };

  await docClient.send(new UpdateCommand(params));
};

/**
 * Queries all items from DynamoDB, handling pagination.
 * @param {Object} params - The query parameters.
 * @returns {Promise<Array>} All items retrieved from the query.
 */
async function queryAllItems(params) {
  const allItems = [];
  let lastEvaluatedKey = null;

  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await docClient.send(new QueryCommand(params));
    allItems.push(...(result.Items || []));
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return allItems;
}