import express from 'express';
import { clerkClient } from '../../utils/clerkClient.js';

const router = express.Router();

// Функція для створення об'єкта запиту, сумісного з Clerk
const createClerkCompatibleRequest = req => {
  const url = new URL(req.originalUrl, `http://${req.headers.host}`);
  return {
    method: req.method,
    url: url.toString(),
    headers: req.headers,
  };
};

const authenticateMiddleware = async (req, res, next) => {
  try {
    const clerkRequest = createClerkCompatibleRequest(req);
    const { isSignedIn, userId, sessionId } =
      await clerkClient.authenticateRequest(clerkRequest);

    if (!isSignedIn) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.auth = { userId, sessionId };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res
      .status(401)
      .json({ error: 'Authentication failed', details: error.message });
  }
};

router.get('/', authenticateMiddleware, async (req, res) => {
  try {
    const { userId } = req.auth;

    const user = await clerkClient.users.getUser(userId);

    res.json({
      message: 'This is Protected Route!',
      userId: userId,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
