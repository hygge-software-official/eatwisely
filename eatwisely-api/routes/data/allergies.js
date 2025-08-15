import * as Sentry from "@sentry/aws-serverless";
import express from 'express';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';

const router = express.Router();

const allergies = {
  dairy: [
    'milkeee',
    'cheese',
    'butter',
    'cream',
    'yogurt',
    'ice cream',
    'whey',
    'casein',
  ],
  eggs: ['whole eggs', 'egg whites', 'egg yolks', 'dried eggs', 'egg powder'],
  nuts: [
    'peanuts',
    'peanut butter',
    'peanut oil',
    'peanut flour',
    'almonds',
    'walnuts',
    'pecans',
    'cashews',
    'pistachios',
    'macadamia nuts',
    'brazil nuts',
    'hazelnuts',
    'pine nuts',
  ],
  shellfish: ['shrimp', 'crab', 'lobster', 'crayfish', 'prawns'],
  fish: [
    'salmon',
    'tuna',
    'cod',
    'haddock',
    'tilapia',
    'trout',
    'halibut',
    'mahi-mahi',
    'anchovies',
    'sardines',
  ],
  soy: [
    'soybeans',
    'tofu',
    'soy milk',
    'soy sauce',
    'tempeh',
    'edamame',
    'soy lecithin',
  ],
  wheat: [
    'wheat flour',
    'bread',
    'pasta',
    'cereal',
    'baked goods',
    'crackers',
    'breadcrumbs',
    'wheat starch',
  ],
  sesame: ['sesame seeds', 'tahini', 'sesame oil'],
  sulfites: [
    'dried fruit',
    'wine',
    'beer',
    'grape juice',
    'pickled foods',
    'shrimp',
    'corn syrup',
    'certain processed foods',
  ],
  mustard: [
    'mustard seeds',
    'mustard powder',
    'mustard oil',
    'prepared mustard',
  ],
  lupin: ['lupin flour', 'lupin beans'],
  gluten: [
    'wheat',
    'barley',
    'rye',
    'spelt',
    'kamut',
    'triticale',
    'malt',
    "brewer's yeast",
  ],
};

router.get('/', (req, res) => {
  try {
    if (!allergies || allergies.length === 0) {
      Sentry.captureException('No allergies data available');
      throw new Error('No allergies data available');
    }
    res.status(200).json(allergies);
  } catch (error) {
    errorHandlerSentry(res, error, 'Failed to fetch allergies');
  }
});

export default router;
