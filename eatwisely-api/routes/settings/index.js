import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import * as Sentry from '@sentry/aws-serverless';
import express from 'express';
import { GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { client } from '../../utils/dynamoDB.js';
import { clerkClient } from '../../utils/clerkClient.js';
import { handleClerkError } from '../../utils/clerkErrorHandler.js';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';
import { sendSNSMessage } from '../../utils/sendSNSMessage.js';
import { ERROR_MESSAGES, HTTP_STATUS } from './const.js';
import {
  setConnectsForUser,
  checkUserIdAndTable,
  getUserSettings,
  getUserRecipeCount,
  getEndpointArnForUser,
  deleteUserRecipes,
  getUserRecipes,
  updateUserSettings,
  subtractConnects,
} from './helpers.js';

import { DEFAULT_CONNECTS, USER_SETTINGS_TABLE } from '../../utils/config.js';

const router = express.Router();

const docClient = DynamoDBDocumentClient.from(client);

router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!(await checkUserIdAndTable(userId, res))) return;

  try {
    const userSettings = await getUserSettings(userId);

    const recipeCount = await getUserRecipeCount(userId);

    const response = {
      ...userSettings,
      recipeCount,
      feedbackSubmitted: userSettings.feedbackSubmitted || false,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching settings:', error);
    errorHandlerSentry(res, error, 'Failed to fetch settings');
  }
});

router.post('/save', async (req, res) => {
  const { userId } = req.query;
  const newSettings = req.body;
  if (!(await checkUserIdAndTable(userId, res))) return;

  try {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(newSettings).forEach((key, index) => {
      updateExpressions.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = key;
      expressionAttributeValues[`:value${index}`] = newSettings[key];
    });

    const updateParams = {
      TableName: USER_SETTINGS_TABLE,
      Key: marshall({ userId }),
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      ReturnValues: 'ALL_NEW',
    };

    const updateResult = await client.send(new UpdateItemCommand(updateParams));
    const finalSettings = unmarshall(updateResult.Attributes);

    res.status(200).json({
      message: 'Settings saved successfully',
      settings: finalSettings,
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    errorHandlerSentry(res, error, 'Failed to save settings');
  }
});

router.put('/update', async (req, res) => {
  const { userId } = req.query;
  const updates = req.body;
  if (!(await checkUserIdAndTable(userId, res))) return;

  try {
    const updatedSettings = await updateUserSettings(userId, updates);
    res.status(200).json(updatedSettings);
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to update settings');
  }
});

router.delete('/', async (req, res) => {
  const { userId } = req.query;
  if (!(await checkUserIdAndTable(userId, res))) return;

  try {
    const getParams = {
      TableName: USER_SETTINGS_TABLE,
      Key: marshall({ userId }),
    };

    const { Item } = await client.send(new GetItemCommand(getParams));
    if (!Item) {
      return res.status(404).json({ error: 'User settings not found' });
    }

    const currentSettings = unmarshall(Item);
    const { connects, initialConnects, excludeTitles } = currentSettings;

    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    const addToUpdate = (field, value, defaultValue) => {
      if (value !== undefined) {
        updateExpressions.push(`#${field} = :${field}`);
        expressionAttributeNames[`#${field}`] = field;
        expressionAttributeValues[`:${field}`] = value;
      } else if (defaultValue !== undefined) {
        updateExpressions.push(`#${field} = :${field}`);
        expressionAttributeNames[`#${field}`] = field;
        expressionAttributeValues[`:${field}`] = defaultValue;
      }
    };

    addToUpdate('diet', '', '');
    addToUpdate('allergies', [], []);
    addToUpdate('goal', '', '');
    addToUpdate('dislikes', [], []);
    addToUpdate('connects', connects);
    addToUpdate('initialConnects', initialConnects);
    addToUpdate('excludeTitles', excludeTitles);

    const updateParams = {
      TableName: USER_SETTINGS_TABLE,
      Key: marshall({ userId }),
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      ReturnValues: 'UPDATED_NEW',
    };

    const updateResult = await client.send(new UpdateItemCommand(updateParams));
    const updatedSettings = unmarshall(updateResult.Attributes);
    console.log('Updated user settings:', updatedSettings);

    res.status(200).json({
      message: 'Settings cleared successfully',
      updatedSettings: {
        ...updatedSettings,
        connects,
        initialConnects,
        excludeTitles,
      },
    });
  } catch (error) {
    console.error('Error in clearing settings:', error);
    errorHandlerSentry(res, error, 'Failed to clear settings');
  }
});

router.put('/connects', async (req, res) => {
  const { userId, subtractCount } = req.query;
  if (!userId || !subtractCount) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.CONNECTS_REQUIRED });
  }
  if (!(await checkUserIdAndTable(userId, res))) return;

  try {
    const result = await subtractConnects(userId, subtractCount);
    if (result.error) {
      return res.status(400).json(result);
    }

    res.status(200).json({
      message: 'Connects subtracted successfully',
      connects: result.connects,
    });
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to subtract connects');
  }
});

router.put('/set-connects', async (req, res) => {
  const { userId, connects, skipNotification } = req.query;
  if (!(await checkUserIdAndTable(userId, res))) return;

  const connectsToAdd =
    connects !== undefined ? parseInt(connects, 10) : DEFAULT_CONNECTS;
  if (isNaN(connectsToAdd) || connectsToAdd < 0) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.INVALID_CONNECTS });
  }

  try {
    const updatedSettings = await setConnectsForUser(userId, connectsToAdd);

    // Send push notification if skipNotification is not true
    if (skipNotification !== 'true') {
      const endpointArn = await getEndpointArnForUser(userId);
      if (endpointArn) {
        await sendSNSMessage(endpointArn, updatedSettings.connects, connectsToAdd);
      }
    }

    res.status(200).json({
      message: 'Connects set successfully',
      connects: updatedSettings.connects,
      initialConnects: updatedSettings.initialConnects,
    });
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to set connects');
  }
});

router.put('/connects/all', async (req, res) => {
  const connectsToAdd =
    req.query.connects !== undefined
      ? parseInt(req.query.connects, 10)
      : DEFAULT_CONNECTS;

  if (isNaN(connectsToAdd) || connectsToAdd < 0) {
    console.error('Invalid connects value:', req.query.connects);
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.INVALID_CONNECTS });
  }

  try {
    console.log('Fetching user list from Clerk...');
    const clientListResponse = await clerkClient.users.getUserList();
    const clientList = clientListResponse.data;

    if (!Array.isArray(clientList)) {
      console.error(
        'Unexpected format received from getUserList()',
        clientListResponse
      );
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: ERROR_MESSAGES.UNEXPECTED_FORMAT });
    }

    console.log(`Retrieved ${clientList.length} users from Clerk.`);

    // Iterate over each user and update connects
    const updatePromises = clientList.map(async user => {
      try {
        console.log(`Adding connects for user ${user.id} by ${connectsToAdd}`);
        const result = await setConnectsForUser(user.id, connectsToAdd);
        console.log(`Successfully updated user ${user.id}`, result);

        // Get user's endpointArn from DynamoDB
        const endpointArn = await getEndpointArnForUser(user.id);

        if (endpointArn) {
          await sendSNSMessage(endpointArn, result.connects);
        } else {
          console.warn(
            `No endpointArn found for user ${user.id}. Skipping SNS message.`
          );
        }

        return { userId: user.id, success: true, result };
      } catch (updateError) {
        console.error(
          `Error updating connects for user ${user.id}:`,
          updateError.message
        );
        Sentry.captureException(
          `Error updating connects for user ${user.id}: ${updateError.message}`
        );
        return { userId: user.id, success: false, error: updateError.message };
      }
    });

    const results = await Promise.all(updatePromises);
    console.log('Connects addition process completed for all users.');

    res
      .status(200)
      .json({ message: 'Connects addition completed for all users', results });
  } catch (error) {
    console.error(
      'Error during batch addition of connects for all users:',
      error
    );
    const errorMessage = handleClerkError(error);
    errorHandlerSentry(
      res,
      error,
      `Error during batch addition of connects for all users: ${errorMessage}`,
      500
    );
  }
});

router.delete('/delete-user-settings', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.USER_ID_REQUIRED });
  }

  try {
    let settingsDeleted = false;

    const getSettingsParams = {
      TableName: USER_SETTINGS_TABLE,
      Key: { userId },
    };

    const { Item: userSettings } = await docClient.send(
      new GetCommand(getSettingsParams)
    );

    if (userSettings) {
      await docClient.send(new DeleteCommand(getSettingsParams));
      console.log('User settings deleted successfully');
      settingsDeleted = true;
    } else {
      console.log('User settings not found');
    }

    const userRecipes = await getUserRecipes(userId);
    if (userRecipes.length > 0) {
      await deleteUserRecipes(userId);
      console.log('User recipes deleted successfully');
    } else {
      console.log('No recipes found for the user');
    }

    if (settingsDeleted && userRecipes.length > 0) {
      res
        .status(200)
        .json({ message: 'User settings and recipes deleted successfully' });
    } else if (settingsDeleted) {
      res.status(200).json({
        message:
          'User settings deleted successfully. No recipes found for the user.',
      });
    } else if (userRecipes.length > 0) {
      res.status(200).json({
        message:
          'User recipes deleted successfully. No settings found for the user.',
      });
    } else {
      res
        .status(404)
        .json({ message: 'No settings or recipes found for the user' });
    }
  } catch (error) {
    console.error('Error deleting user settings and recipes:', error);
    errorHandlerSentry(
      res,
      error,
      'Failed to delete user settings and recipes'
    );
  }
});

export default router;
