import { createClerkClient } from '@clerk/clerk-sdk-node';
import getSecretValue from './secrets.js';

const secrets = await getSecretValue();

const clerkClient = createClerkClient({
  secretKey: secrets.CLERK_SECRET_KEY_DEV,
  publishableKey: secrets.CLERK_PUBLISHABLE_KEY_DEV,
});

export { clerkClient };
