import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import * as Sentry from "@sentry/aws-serverless";
import getSecretValue from './secrets.js';

// Constants
const REGION = 'us-east-1';
const DEFAULT_TABLE_NAME = 'Users';

// Initialize client
const initializeClient = async () => {
  const secrets = await getSecretValue();
  return new DynamoDBClient({
    region: REGION,
    credentials: {
      accessKeyId: secrets.AWS_ACCESS_KEY_ID_INNER ?? '',
      secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY_INNER ?? '',
    },
  });
};

export const client = await initializeClient();

// Function to convert recipe to DynamoDB format
const recipeToDbItem = (recipe) => ({
  userId: { S: recipe.userId },
  createdAt: { S: recipe.createdAt },
  preferences: { S: JSON.stringify(recipe.preferences) },
  recipe: { S: recipe.recipe },
});

export const saveRecipe = async (recipe) => {
  const secrets = await getSecretValue();
  const params = {
    TableName: secrets.DYNAMODB_TABLE || DEFAULT_TABLE_NAME,
    Item: recipeToDbItem(recipe),
  };

  try {
    await client.send(new PutItemCommand(params));
  } catch (error) {
    Sentry.captureException(`Invalid saveRecipe: ${error}`);
    throw error;
  }
};