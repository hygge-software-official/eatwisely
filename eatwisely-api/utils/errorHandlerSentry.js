import * as Sentry from '@sentry/aws-serverless';

export const errorHandlerSentry = (res, error, message, statusCode = 500) => {
  console.error(`Error: ${message}`, error);

  Sentry.captureException(error);

  if (res && !res.headersSent) {
    res.status(statusCode).json({
      error: message,
      details: error.message,
    });
  }
};
