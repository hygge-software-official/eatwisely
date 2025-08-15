import express from 'express';
import { clerkClient } from '../../utils/clerkClient.js';

import checkPhoneRouter from './check-phone.js';

const router = express.Router();

async function checkExistingUser(email, phoneNumber) {
  try {
    let user = null;

    if (email) {
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });

      if (users.data.length > 0) {
        user = users.data[0];
        console.log('Existing user found by email:', user.id);
        return user;
      }
    }

    if (phoneNumber) {
      const users = await clerkClient.users.getUserList({
        phoneNumber: [phoneNumber],
      });

      if (users.data.length > 0) {
        user = users.data[0];
        console.log('Existing user found by phone number:', user.id);
        return user;
      }
    }

    console.log('No existing user found');
    return null;
  } catch (error) {
    console.error('Error in checkExistingUser:', error);
    throw error;
  }
}

async function signInUser(user) {
  try {
    
    const signInToken = await clerkClient.signInTokens.createSignInToken({
      userId: user.id,
      expiresInSeconds: 60 * 60 * 24 * 30,
    });

    
    const oauthTokens = {};
    const providers = ['oauth_google', 'oauth_apple'];

    for (const provider of providers) {
      try {
        const [oauthToken] = await clerkClient.users.getUserOauthAccessToken(
          user.id,
          provider
        );
        if (oauthToken) {
          oauthTokens[provider] = oauthToken.token;
        }
      } catch (error) {
        console.log(`No OAuth token found for ${provider}`);
        console.error(error);
      }
    }

    return {
      user,
      signInToken: signInToken.token,
      signInUrl: signInToken.url,
      oauthTokens,
    };
  } catch (error) {
    console.error('Error in signInUser:', error);
    throw error;
  }
}

router.post('/auth', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ error: 'Email or phone number is required' });
    }

    const existingUser = await checkExistingUser(email, phoneNumber);

    if (existingUser) {
      const signInResult = await signInUser(existingUser);

      res.json({
        userId: signInResult.user.id,
        signInToken: signInResult.signInToken,
        signInUrl: signInResult.signInUrl,
        oauthTokens: signInResult.oauthTokens,
        email: signInResult.user.emailAddresses[0]?.emailAddress,
        phoneNumber: signInResult.user.phoneNumbers[0]?.phoneNumber,
        firstName: signInResult.user.firstName,
        lastName: signInResult.user.lastName,
      });
    } else {

      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res
      .status(500)
      .json({ error: 'Authentication failed', details: error.message });
  }
});


router.use('/check-phone', checkPhoneRouter);

export default router;
