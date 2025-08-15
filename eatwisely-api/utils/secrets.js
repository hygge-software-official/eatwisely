import * as Sentry from "@sentry/aws-serverless";
import fs from 'fs';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

console.log('process.env.IS_OFFLINE: ', process.env.IS_OFFLINE);

const SECRET_ID = 'eatwisely-api-secrets';
const LOCAL_SECRETS_PATH = './secrets.json';
const REGION = 'us-east-1';

const secretsManagerClient = new SecretsManagerClient({ region: REGION });

function getLocalSecrets() {
  if (!fs.existsSync(LOCAL_SECRETS_PATH)) {
    const error = new Error(`Local secrets file not found: ${LOCAL_SECRETS_PATH}`);
    Sentry.captureException(error);
    throw error;
  }
  return JSON.parse(fs.readFileSync(LOCAL_SECRETS_PATH, 'utf-8'));
}

async function getAwsSecrets() {
  console.log('getAwsSecrets');
  const command = new GetSecretValueCommand({ SecretId: SECRET_ID });
  const response = await secretsManagerClient.send(command);
  console.log('response.SecretString: ', response.SecretString);
  return JSON.parse(response.SecretString);
}

async function getSecretValue() {
  try {
    return process.env.IS_OFFLINE === 'true'
      ? getLocalSecrets()
      : await getAwsSecrets();
  } catch (error) {
    console.error('Error retrieving secrets:', error);
    throw error;
  }
}

export default getSecretValue;