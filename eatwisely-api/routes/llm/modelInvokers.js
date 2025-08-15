import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import * as Sentry from "@sentry/aws-serverless";
import { get_encoding } from 'tiktoken';
import { modelMap } from './config.js';

const countTokens = text => {
  const encoder = get_encoding('gpt2');
  return encoder.encode(text).length;
};

export const invokeLlamaModel = async (
  bedrockClient,
  modelId,
  prompt,
  params
) => {
  const { max_gen_len, temperature, top_p } = params;
  const requestBody = {
    prompt,
    max_gen_len: parseInt(max_gen_len, 10),
    temperature: parseFloat(temperature),
    top_p: parseFloat(top_p),
  };

  const command = new InvokeModelCommand({
    contentType: 'application/json',
    body: JSON.stringify(requestBody),
    modelId,
  });

  try {
    const response = await bedrockClient.send(command);
    const nativeResponse = JSON.parse(new TextDecoder().decode(response.body));
    const outputTokens = countTokens(nativeResponse.generation);

    return {
      generation: nativeResponse.generation,
      tokenCount: outputTokens,
    };
  } catch (error) {
    console.error('Error invoking Llama model:', error);
    Sentry.captureException(`Llama model invocation failed: ${error.message}`);
    throw new Error(`Llama model invocation failed: ${error.message}`);
  }
};

export const invokeOpenAiModel = async (openai, prompt, params) => {
  const {
    model,
    max_gen_len,
    temperature,
    top_p,
    presence_penalty,
    frequency_penalty,
  } = params;

  const requestBody = {
    model: modelMap[model] || model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: parseInt(max_gen_len, 10),
    temperature: parseFloat(temperature),
    top_p: parseFloat(top_p),
    presence_penalty: parseFloat(presence_penalty),
    frequency_penalty: parseFloat(frequency_penalty),
  };

  const response = await openai.chat.completions.create(requestBody);

  if (!response || !response.choices || response.choices.length === 0) {
    return {
      generation: 'Empty Response',
      tokenCount: 0,
    };
  }

  const completion = response.choices[0]?.message?.content || 'Empty';
  const inputTokens = countTokens(prompt);
  const outputTokens = countTokens(completion);
  const totalTokens = inputTokens + outputTokens;

  return {
    generation: completion,
    tokenCount: totalTokens,
    inputTokens,
    outputTokens,
  };
};


export const invokeClaudeModel = async (
  bedrockClient,
  modelId,
  prompt,
  params
) => {
  const { max_tokens, anthropic_version, temperature, top_p } = params;

  const requestBody = {
    anthropic_version,
    max_tokens: parseInt(max_tokens, 10),
    temperature: parseFloat(temperature),
    top_p: parseFloat(top_p),
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  const command = new InvokeModelCommand({
    contentType: 'application/json',
    body: JSON.stringify(requestBody),
    modelId,
  });

  try {
    const response = await bedrockClient.send(command);
    const nativeResponse = JSON.parse(new TextDecoder().decode(response.body));
    const content = nativeResponse.content[0]?.text || '';
    const outputTokens = countTokens(content);

    return {
      generation: content,
      tokenCount: outputTokens,
    };
  } catch (error) {
    console.error('Error invoking Claude model:', error);
    Sentry.captureException(`Claude model invocation failed: ${error.message}`);
    throw new Error(`Claude model invocation failed: ${error.message}`);
  }
};

export const invokeOpenAiAssistant = async (openai, prompt, params) => {
  const {
    assistantId,
    model,
    maxCompletionTokens,
    maxPromptTokens,
    temperature,
    role,
  } = params;

  try {
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: role || 'user',
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      model: model,
      instructions: 'Please provide a concise and relevant response.',
      max_completion_tokens: maxCompletionTokens,
      max_prompt_tokens: maxPromptTokens,
      temperature: temperature,
    });

    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } while (runStatus.status !== 'completed');

    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantResponse = messages.data
      .filter(message => message.role === 'assistant')
      .pop();

    return {
      generation: assistantResponse
        ? assistantResponse.content[0].text.value
        : 'No response',
      tokenCount: runStatus.usage ? runStatus.usage.total_tokens : 0,
    };
  } catch (error) {
    console.error('Error in invokeOpenAiAssistant:', error);
    return {
      generation: 'Error: ' + error.message,
      tokenCount: 0,
    };
  }
};
