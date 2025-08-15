import express from 'express';

import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

import { client } from '../../utils/dynamoDB.js';

import { ERROR_MESSAGES, HTTP_STATUS } from './const.js';
import { validateFeedbackInput } from './helpers.js';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import {
  USER_FEEDBACKS_TABLE,
  USER_SETTINGS_TABLE,
} from '../../utils/config.js';

const router = express.Router();
const docClient = DynamoDBDocumentClient.from(client);

router.post('/submit', async (req, res) => {
  const { userId, rating, message } = req.body;

  const validationErrors = validateFeedbackInput(userId, rating, message);
  if (validationErrors) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ errors: validationErrors });
  }

  const timestamp = Date.now();

  const params = {
    TableName: USER_FEEDBACKS_TABLE,
    Item: {
      userId,
      timestamp,
      rating,
      message,
    },
  };

  try {
    await docClient.send(new PutCommand(params));

    // Update user settings
    const updateSettingsParams = {
      TableName: USER_SETTINGS_TABLE,
      Key: marshall({ userId }),
      UpdateExpression: 'SET feedbackSubmitted = :feedbackSubmitted',
      ExpressionAttributeValues: marshall({ ':feedbackSubmitted': true }),
    };

    await client.send(new UpdateItemCommand(updateSettingsParams));

    res.status(HTTP_STATUS.OK).json({
      message: 'Feedback successfully saved and user settings updated',
    });
  } catch (error) {
    errorHandlerSentry(
      res,
      error,
      ERROR_MESSAGES.SAVE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
});

router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.INVALID_USER_ID });
  }

  const params = {
    TableName: USER_FEEDBACKS_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    ScanIndexForward: false,
  };

  try {
    const { Items } = await docClient.send(new QueryCommand(params));
    res.status(HTTP_STATUS.OK).json(Items);
  } catch (error) {
    errorHandlerSentry(
      res,
      error,
      ERROR_MESSAGES.FETCH_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
});

router.delete('/', async (req, res) => {
  const { userId, timestamp } = req.query;

  if (
    !userId ||
    typeof userId !== 'string' ||
    !timestamp ||
    isNaN(parseInt(timestamp, 10))
  ) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.INVALID_USER_ID });
  }

  const params = {
    TableName: USER_FEEDBACKS_TABLE,
    Key: {
      userId: userId,
      timestamp: parseInt(timestamp, 10),
    },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Feedback successfully deleted' });
  } catch (error) {
    errorHandlerSentry(
      res,
      error,
      ERROR_MESSAGES.DELETE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
});

export default router;
