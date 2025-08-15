import * as Sentry from '@sentry/aws-serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { SENTRY_DSN } from './utils/config.js';
import express from 'express';
import dotenv from 'dotenv';
import ingredients from './utils/ingredients.js';
import allergies from './utils/allergies.js';
import recipesRouter from './routes/recipesRoute.js';
import userRouter from './routes/userRoute.js';
import healthRouter from './routes/healthRoute.js';
import sandboxRoute from './routes/sandboxRoute.js';
import tokenRouter from './routes/tokenRoute.js';
import llmSandboxRoute from './routes/llmSandboxRoute.js';
import sandboxLogsRouter from './routes/sandboxLogsRoute.js';
import authRouter from './routes/auth/index.js';
import dataRouter from './routes/data/index.js';
import protectedRoute from './routes/protected/index.js';
import recipeRoute from './routes/llm/index.js';
import settingsRoute from './routes/settings/index.js';
import userRoute from './routes/user/index.js';
import snsRoute from './routes/sns/index.js';
import feedbackRouter from './routes/feedback/index.js';
import paymentsRouter from './routes/payments/index.js';
import iapRouter from './routes/iap/index.js';

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

dotenv.config();

const ver = 'v1';

const app = express();

app.use(express.json());

app.get(`/${ver}/ingredients`, (req, res) => {
  res.status(200).json({ ingredients });
});

app.get(`/${ver}/allergies`, (req, res) => {
  res.status(200).json({ allergies });
});

app.use(`/${ver}/recipes`, recipesRouter);

app.use(`/${ver}/users`, userRouter);

app.use(`/${ver}/health`, healthRouter);

app.use(`/${ver}/sandbox`, sandboxRoute);

app.use(`/${ver}/tokens`, tokenRouter);

app.use(`/${ver}/llm`, llmSandboxRoute);

app.use(`/${ver}/logs`, sandboxLogsRouter);

app.use(`/${ver}/auth`, authRouter);

app.use(`/${ver}/data`, dataRouter);

app.use(`/${ver}/protected`, protectedRoute);

app.use(`/${ver}/ai`, recipeRoute);

app.use(`/${ver}/settings`, settingsRoute);

app.use(`/${ver}/user`, userRoute);

app.use(`/${ver}/sns`, snsRoute);

app.use(`/${ver}/feedback`, feedbackRouter);

app.use(`/${ver}/payments`, paymentsRouter);

app.use(`/${ver}/iap`, iapRouter);

app.get(`/${ver}/`, (req, res) => {
  res.status(200).json({ message: 'Hello from root!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((error, req, res) => {
  console.error('Global error handler:', error);
  res
    .status(500)
    .json({ error: 'Internal Server Error', details: error.message });
});

if (process.env.IS_OFFLINE) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}

export default app;