import { createClerkClient } from '@clerk/clerk-sdk-node';
import * as Sentry from "@sentry/aws-serverless";
import getSecretValue from './secrets.js';

/**
 * Creates a Clerk client instance using the secret key from environment variables.
 * @type {import('@clerk/clerk-sdk-node').Clerk}
 */
const clerkClient = createClerkClient({
  secretKey: (await getSecretValue()).CLERK_SECRET_KEY,
});

/**
 * Verifies a Clerk session token and returns the associated user.
 * @param {string} token - The Clerk session token to verify.
 * @returns {Promise<import('@clerk/clerk-sdk-node').User>} The user associated with the token.
 * @throws {Error} If the token is invalid or verification fails.
 */
export const verifyClerkToken = async (token) => {
  try {
    const session = await clerkClient.sessions.verifySession(token);
    return session.user;
  } catch (error) {
    Sentry.captureException(`Invalid token: ${error.message}`);
    throw new Error('Invalid token');
  }
};