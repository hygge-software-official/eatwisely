import express from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const router = express.Router();

const getSandboxLogs = async (offset, limit) => {
  const params = {
    TableName: 'recipeSandbox',
    Limit: limit,
    ExclusiveStartKey: offset ? { pk: offset } : undefined,
  };

  const command = new ScanCommand(params);
  const result = await docClient.send(command);

  return result;
};

router.get('/sandboxLogs', async (req, res) => {
  const { offset, limit } = req.query;

  if (!limit || isNaN(limit)) {
    return res
      .status(400)
      .json({ error: 'Limit is required and must be a number' });
  }

  try {
    const data = await getSandboxLogs(offset, parseInt(limit, 10));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching sandbox logs:', error);
    // res.status(500).json({ error: 'Internal Server Error' });
    res.status(500).json({ error });
  }
});

export default router;
