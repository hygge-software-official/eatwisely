import express from 'express';
import { checkHealth } from '../utils/healthService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const healthStatus = await checkHealth();
  console.log('healthStatus: ', healthStatus);
  res.status(200).json(healthStatus);
});

export default router;
