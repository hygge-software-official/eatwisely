import serverless from 'serverless-http';
import * as Sentry from '@sentry/aws-serverless';
import app from './index.js';

// export const handler = serverless(app);

export const handler = Sentry.wrapHandler(serverless(app));
