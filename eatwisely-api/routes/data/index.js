import express from 'express';
import allergiesRouter from './allergies.js';
import cuisineRouter from './cuisine.js';
import ingredientsRouter from './ingredients.js';
import dietsRouter from './diets.js';

const router = express.Router();

router.use('/allergies', allergiesRouter);
router.use('/cuisine', cuisineRouter);
router.use('/ingredients', ingredientsRouter);
router.use('/diets', dietsRouter);

export default router;
