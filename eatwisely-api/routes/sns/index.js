import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import * as Sentry from '@sentry/aws-serverless';
import express from 'express';
import {
  CreatePlatformEndpointCommand,
  SubscribeCommand,
} from '@aws-sdk/client-sns';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';

import { snsClient } from '../../utils/sendSNSMessage.js';

import { client } from '../../utils/dynamoDB.js';
import { ANDROID_PLATFORM_ARN, IOS_PLATFORM_ARN } from '../settings/const.js';
import { USER_SETTINGS_TABLE } from '../../utils/config.js';
const router = express.Router();

async function registerDevice(deviceToken, platformArn, userId) {
  try {
    const params = {
      PlatformApplicationArn: platformArn,
      Token: deviceToken,
    };

    const command = new CreatePlatformEndpointCommand(params);
    const response = await snsClient.send(command);

    const endpointArn = response.EndpointArn;

    const updateParams = {
      TableName: USER_SETTINGS_TABLE,
      Key: {
        userId: { S: userId },
      },
      UpdateExpression: 'SET endpointArn = :endpointArn',
      ExpressionAttributeValues: {
        ':endpointArn': { S: endpointArn },
      },
      ReturnValues: 'UPDATED_NEW',
    };

    await client.send(new UpdateItemCommand(updateParams));

    console.log('Endpoint ARN saved in DynamoDB:', endpointArn);

    return endpointArn;
  } catch (error) {
    Sentry.captureException(`Error creating platform endpoint ${error}`);
    console.error('Error creating platform endpoint:', error);
    throw error;
  }
}

async function subscribeEndpointToTopic(endpointArn, topicArn) {
  try {
    const params = {
      Protocol: 'application',
      TopicArn: topicArn,
      Endpoint: endpointArn,
    };

    const command = new SubscribeCommand(params);
    const response = await snsClient.send(command);
    // Sentry.captureException(`Subscription ARN ${response.SubscriptionArn}`);
    console.log('Subscription ARN:', response.SubscriptionArn);
  } catch (error) {
    Sentry.captureException(`Error subscribing endpoint to topic ${error}`);
    console.error('Error subscribing endpoint to topic:', error);
    throw error;
  }
}

router.post('/register-device', async (req, res) => {
  const { deviceToken, platform, userId } = req.body;

  if (!deviceToken || !platform || !userId) {
    Sentry.captureException(`Device token, platform, and userId are required`);
    return res
      .status(400)
      .json({ error: 'Device token, platform, and userId are required' });
  }

  try {
    const platformArn =
      platform === 'android' ? ANDROID_PLATFORM_ARN : IOS_PLATFORM_ARN;
    const endpointArn = await registerDevice(deviceToken, platformArn, userId);

    const topicArn =
      'arn:aws:sns:us-east-1:767397662013:UserConnectsNotifications';
    await subscribeEndpointToTopic(endpointArn, topicArn);

    res
      .status(200)
      .json({ message: 'Device registered successfully', endpointArn });
  } catch (error) {
    console.error('Error during device registration:', error);
    errorHandlerSentry(res, error, `Failed to register device ${error}`, 500);
  }
});

export default router;
