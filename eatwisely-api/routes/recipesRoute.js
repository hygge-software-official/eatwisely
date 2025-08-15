import express from 'express';
import openAiStart from '../lib/openaiService.js';
import { verifyClerkToken } from '../utils/clerkAuth.js';
import { saveRecipe } from '../utils/dynamoDB.js';

const router = express.Router();

/**
 * Handles POST requests to generate and save a recipe.
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
router.post('/', async (req, res) => {
  const { authorization: token } = req.headers;
  const { preferences } = req.body;

  try {
    const user = await verifyClerkToken(token);
    const recipeText = await openAiStart(preferences);

    const recipe = {
      userId: user.id,
      preferences,
      recipe: recipeText,
      createdAt: new Date().toISOString(),
    };

    await saveRecipe(recipe);

    res.json({ recipe: recipeText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;