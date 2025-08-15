import express from 'express';
import { clerkClient } from '../../utils/clerkClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const users = await clerkClient.users.getUserList({
      phoneNumber: [phoneNumber],
    });

    const userExists = users.totalCount > 0;

    res.json({
      exists: userExists,
      phoneNumber,
      userData: userExists
        ? {
            userId: users.data[0].id,
            firstName: users.data[0].firstName,
            lastName: users.data[0].lastName,
          }
        : null,
    });
  } catch (error) {
    console.error('Error checking phone number:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
});

export default router;
