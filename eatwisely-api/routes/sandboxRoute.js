import express from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ExecuteStatementCommand,
} from '@aws-sdk/lib-dynamodb';

// import logger from '../utils/logger.js';

const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);

const ITEM_PK = 'ITEM';

const saveItem = async (tableName, data) => {
  const SK = ITEM_PK + '#' + data?.label; //format PK#label => manage default label sorting

  let result;
  try {
    const command = new ExecuteStatementCommand({
      Statement: `INSERT INTO ${tableName} value {'pk':?,'sk':?,'label':?, 'category':?, 'price':?}`,
      Parameters: [ITEM_PK, SK, data?.label, data?.category, data?.price],
    });

    result = await docClient.send(command);
  } catch (error) {
    console.error(JSON.stringify(error));
    return error;
  }

  return result;
};

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json('OK');
});

router.post('/save', async (req, res) => {
  const tableName = 'recipeSandbox';
  const data = req.body;

  try {
    const result = await saveItem(tableName, data);
    res.status(200).json({ message: 'Item saved successfully', result });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to save item', details: error.message });
  }
});

export default router;
