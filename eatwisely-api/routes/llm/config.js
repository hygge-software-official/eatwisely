export const modelMap = {
  'llama3-8b': 'meta.llama3-8b-instruct-v1:0',
  'gpt-4': 'gpt-4o-2024-08-06',
  'gpt-3.5': 'gpt-3.5-turbo-1106',
  'claude-3': 'anthropic.claude-3-sonnet-20240229-v1:0',
  'claude-3-5': 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  'gpt-assistant': 'gpt-4o',
  'gpt4-latest': 'gpt-4o-2024-08-06',
  'gpt-4o-mini': 'gpt-4o-mini',
  'gpt-4mini-latest': 'gpt-4o-mini-2024-07-18',
};

export const defaultParams = {
  'llama3-8b': {
    max_gen_len: 1024,
    temperature: 0.7,
    top_p: 0.9,
  },
  'gpt-4': {
    max_gen_len: 512,
    temperature: 0.5,
    top_p: 0.9,
  },
  'gpt-3.5': {
    max_gen_len: 512,
    temperature: 0.5,
    top_p: 0.9,
  },
  'claude-3': {
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 0.9,
  },
  'claude-3-5': {
    max_gen_len: 512,
    temperature: 0.5,
    top_p: 0.9,
  },
  'gpt-assistant': {
    max_completion_tokens: 1000,
    max_prompt_tokens: 4000,
    temperature: 0.7,
    role: 'user',
  },
  'gpt-4o-mini': {
    max_gen_len: 256,
    temperature: 0.7,
    top_p: 0.9,
  },
  'gpt-4mini-latest': {
    max_gen_len: 256,
    temperature: 0.7,
    top_p: 0.9,
  },
  default: {
    max_gen_len: 512,
    temperature: 0.5,
    top_p: 0.9,
  },
};

export const validateAndParseParams = (value, defaultValue) => {
  const parsed = parseFloat(value);
  return !isNaN(parsed) ? parsed : defaultValue;
};
