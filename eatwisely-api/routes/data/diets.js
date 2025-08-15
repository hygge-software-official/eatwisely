import * as Sentry from "@sentry/aws-serverless";
import express from 'express';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';

const router = express.Router();

const diets = [
  "No Specific Diet",
  "Keto",
  "Low-Carb",
  "Mediterranean",
  "Paleo",
  "Pescatarian",
  "Vegan",
  "Vegetarian"
];

router.get('/', (req, res) => {
  try {
    // Check if diets data is available
    if (!diets || diets.length === 0) {
      Sentry.captureException('No diets data available');
      throw new Error('No diets data available');
    }
    // Respond with diets data
    res.status(200).json(diets);
  } catch (error) {
    // Handle any errors and respond with a standardized error message
    errorHandlerSentry(res, error, 'Failed to fetch diets data');
  }
});
export default router;
