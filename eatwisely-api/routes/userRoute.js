import express from 'express';
import { clerkClient } from '../utils/clerkClient.js';
import { handleClerkError } from '../utils/clerkErrorHandler.js';

const router = express.Router();

router.get('/user', async (req, res) => {
  const userId = req.query.id;
  try {
    const user = await clerkClient.users.getUser(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    const errorMessage = handleClerkError(error);
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/clients', async (req, res) => {
  try {
    const clientList = await clerkClient.users.getUserList();
    res.status(200).json(clientList);
  } catch (error) {
    console.error('Error fetching client list:', error);
    const errorMessage = handleClerkError(error);
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/user-by-email', async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await clerkClient.users.getUserList({
      emailAddress: email,
    });

    // console.log('Response from Clerk:', JSON.stringify(response, null, 2));

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = response.data[0];
    console.log('First user:', JSON.stringify(user, null, 2));

    if (!user || typeof user !== 'object') {
      return res.status(500).json({ error: 'Invalid user data received from Clerk' });
    }

    if (!user.id) {
      console.log('User object keys:', Object.keys(user));
      return res.status(500).json({ error: 'User ID not found in Clerk response' });
    }

    res.status(200).json({ userId: user.id });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    const errorMessage = handleClerkError(error);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;