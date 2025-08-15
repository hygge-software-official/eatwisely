import * as Sentry from "@sentry/aws-serverless";
import express from 'express';
import { errorHandlerSentry } from '../../utils/errorHandlerSentry.js';

const router = express.Router();

const cuisine = [
  { label: 'Surprise me', flag: '🎲' },
  { label: 'American', flag: '🇺🇸' },
  { label: 'Argentine', flag: '🇦🇷' },
  { label: 'Brazilian', flag: '🇧🇷' },
  { label: 'British', flag: '🇬🇧' },
  { label: 'Caribbean', flag: '🏝' },
  { label: 'Chinese', flag: '🇨🇳' },
  { label: 'Dutch', flag: '🇳🇱' },
  { label: 'Ethiopian', flag: '🇪🇹' },
  { label: 'Filipino', flag: '🇵🇭' },
  { label: 'French', flag: '🇫🇷' },
  { label: 'German', flag: '🇩🇪' },
  { label: 'Greek', flag: '🇬🇷' },
  { label: 'Indian', flag: '🇮🇳' },
  { label: 'Indonesian', flag: '🇮🇩' },
  { label: 'Italian', flag: '🇮🇹' },
  { label: 'Japanese', flag: '🇯🇵' },
  { label: 'Korean', flag: '🇰🇷' },
  { label: 'Lebanese', flag: '🇱🇧' },
  { label: 'Mediterranean', flag: '🥗' },
  { label: 'Mexican', flag: '🇲🇽' },
  { label: 'Middle Eastern', flag: '🌍' },
  { label: 'Moroccan', flag: '🇲🇦' },
  { label: 'Peruvian', flag: '🇵🇪' },
  { label: 'Russian', flag: '🇷🇺' },
  { label: 'Spanish', flag: '🇪🇸' },
  { label: 'Thai', flag: '🇹🇭' },
  { label: 'Turkish', flag: '🇹🇷' },
  { label: 'Uzbek', flag: '🇺🇿' },
  { label: 'Vietnamese', flag: '🇻🇳' },
];

router.get('/', (req, res) => {
  try {
    if (!cuisine || cuisine.length === 0) {
      Sentry.captureException('No cuisine data available');
      throw new Error('No cuisine data available');
    }
    // Respond with cuisine data
    res.status(200).json(cuisine);
  } catch (error) {
    // Handle any errors and respond with a standardized error message
    errorHandlerSentry(res, error, 'Failed to fetch cuisine data');
  }
});
export default router;
