import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

import getSecretValue from '../utils/secrets.js';

const secrets = await getSecretValue();

console.log('secrets: ', secrets);

const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: secrets.AWS_ACCESS_KEY_ID_INNER ?? '',
    secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY_INNER ?? '',
  },
});

const modelId = 'meta.llama3-8b-instruct-v1:0';

const openAiStart = async function () {
  const userMessage = `You use ingredients provided by user and his personal profile to generate recipes taking into account the user profile.
    Your recipes contain approximate prep and cooking time for each step.Using simplified language you explain how to cook the recipe.`;

  const prompt = `<s>[INST] ${userMessage} [/INST]`;

  const request = {
    prompt,
    max_gen_len: 512,
    temperature: 0.5,
    top_p: 0.9,
  };

  const response = await client.send(
    new InvokeModelCommand({
      contentType: 'application/json',
      body: JSON.stringify(request),
      modelId,
    })
  );

  const nativeResponse = JSON.parse(new TextDecoder().decode(response.body));

  const responseText = nativeResponse.generation;
  return responseText;
};

export default openAiStart;
