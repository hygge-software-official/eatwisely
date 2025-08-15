import express from 'express';

import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

import { client } from '../../utils/dynamoDB.js';

import { ERROR_MESSAGES, HTTP_STATUS, FIELD_NAMES } from './const.js';
import { validatePaymentInput, validateUserId } from './helpers.js';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';
import { PAYMENTS_TABLE } from '../../utils/config.js';

const router = express.Router();
const docClient = DynamoDBDocumentClient.from(client);

const handleError = (res, error, message) => {
  console.error(message, error);
  errorHandlerSentry(error);
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
};

router.post('/process', async (req, res) => {
  try {
    const {
      [FIELD_NAMES.USER_ID]: userId,
      [FIELD_NAMES.CREATED_AT]: createdAt,
      [FIELD_NAMES.PAYMENT_ID]: paymentId,
      [FIELD_NAMES.AMOUNT]: amount,
      [FIELD_NAMES.CURRENCY]: currency,
      [FIELD_NAMES.PAYMENT_METHOD]: paymentMethod,
      [FIELD_NAMES.PAYMENT_TOKEN]: paymentToken,
      [FIELD_NAMES.PRODUCT_ID]: productId,
      [FIELD_NAMES.CREDITS_ADDED]: creditsAdded,
      [FIELD_NAMES.STATUS]: status,
      [FIELD_NAMES.DEVICE_INFO]: deviceInfo,
      [FIELD_NAMES.METADATA]: metadata,
    } = req.body;

    const validationErrors = validatePaymentInput({
      userId,
      createdAt,
      paymentId,
      amount,
      currency,
      paymentMethod,
      paymentToken,
      productId,
      creditsAdded,
      status,
      deviceInfo,
      metadata,
    });

    if (validationErrors.length > 0) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ errors: validationErrors });
    }

    const paymentData = {
      [FIELD_NAMES.USER_ID]: userId,
      [FIELD_NAMES.CREATED_AT]: createdAt,
      [FIELD_NAMES.PAYMENT_ID]: paymentId,
      [FIELD_NAMES.AMOUNT]: amount,
      [FIELD_NAMES.CURRENCY]: currency,
      [FIELD_NAMES.PAYMENT_METHOD]: paymentMethod,
      [FIELD_NAMES.PAYMENT_TOKEN]: paymentToken,
      [FIELD_NAMES.PRODUCT_ID]: productId,
      [FIELD_NAMES.CREDITS_ADDED]: creditsAdded,
      [FIELD_NAMES.STATUS]: status,
      [FIELD_NAMES.DEVICE_INFO]: deviceInfo,
      [FIELD_NAMES.METADATA]: metadata,
    };

    await docClient.send(
      new PutCommand({
        TableName: PAYMENTS_TABLE,
        Item: paymentData,
      })
    );

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: 'Payment processed successfully', paymentId });
  } catch (error) {
    handleError(res, error, 'Error processing payment:');
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const { [FIELD_NAMES.USER_ID]: userId } = req.query;

    if (!validateUserId(userId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGES.INVALID_USER_ID });
    }

    const command = new QueryCommand({
      TableName: PAYMENTS_TABLE,
      KeyConditionExpression: `${FIELD_NAMES.USER_ID} = :userId`,
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false,
    });

    const { Items } = await docClient.send(command);

    if (!Items || Items.length === 0) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'No transactions found for this user' });
    }

    res.status(HTTP_STATUS.OK).json({ transactions: Items });
  } catch (error) {
    handleError(res, error, 'Error in /transactions route:');
  }
});

export default router;
