import express from 'express';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { client } from '../../utils/dynamoDB.js';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';

const router = express.Router();

import { USER_RECIPES_TABLE, USER_SETTINGS_TABLE } from '../../utils/config.js';

const removeUndefinedValues = obj => JSON.parse(JSON.stringify(obj));

const addTitleToExcludeTitles = async (userId, title) => {
  const getUserSettingsParams = {
    TableName: USER_SETTINGS_TABLE,
    Key: marshall({ userId }),
  };

  const { Item: userSettingsItem } = await client.send(
    new GetItemCommand(getUserSettingsParams)
  );
  const userSettings = userSettingsItem ? unmarshall(userSettingsItem) : {};

  const excludeTitles = [...(userSettings.excludeTitles || []), title];

  const updateUserSettingsParams = {
    TableName: USER_SETTINGS_TABLE,
    Key: marshall({ userId }),
    UpdateExpression: 'SET excludeTitles = :excludeTitles',
    ExpressionAttributeValues: marshall(
      removeUndefinedValues({ ':excludeTitles': [...new Set(excludeTitles)] })
    ),
    ReturnValues: 'ALL_NEW',
  };

  const { Attributes } = await client.send(
    new UpdateItemCommand(updateUserSettingsParams)
  );
  return unmarshall(Attributes);
};

const handleRecipeAction = async (userId, recipeId, action) => {
  if (!userId || !recipeId) {
    throw new Error('userId and recipeId are required');
  }

  const getRecipeParams = {
    TableName: USER_RECIPES_TABLE,
    Key: marshall({ userId, recipeId }),
  };
  const { Item: recipeItem } = await client.send(
    new GetItemCommand(getRecipeParams)
  );

  if (!recipeItem) {
    throw new Error('Recipe not found');
  }

  const recipe = unmarshall(recipeItem);
  const title = recipe.recipe?.title;

  if (!title) {
    throw new Error('Recipe title not found');
  }

  const updateRecipeParams = {
    TableName: USER_RECIPES_TABLE,
    Key: marshall({ userId, recipeId }),
    UpdateExpression: `SET ${action} = :value`,
    ExpressionAttributeValues: marshall(
      removeUndefinedValues({ ':value': true })
    ),
    ReturnValues: 'ALL_NEW',
  };
  const { Attributes: updatedRecipeAttributes } = await client.send(
    new UpdateItemCommand(updateRecipeParams)
  );
  const updatedRecipe = unmarshall(updatedRecipeAttributes);

  const updatedUserSettings = await addTitleToExcludeTitles(userId, title);

  return removeUndefinedValues({
    [action]: updatedRecipe[action],
    excludeTitles: updatedUserSettings.excludeTitles,
  });
};

router.put('/recipe/like', async (req, res) => {
  try {
    const result = await handleRecipeAction(
      req.query.userId,
      req.query.recipeId,
      'isLiked'
    );
    res.status(200).json(result);
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to like recipe', 500);
  }
});

router.put('/recipe/save', async (req, res) => {
  try {
    const result = await handleRecipeAction(
      req.query.userId,
      req.query.recipeId,
      'isSaved'
    );
    res.status(200).json(result);
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to save recipe', 500);
  }
});

export default router;
