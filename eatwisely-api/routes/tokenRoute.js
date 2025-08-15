import express from 'express';
import { get_encoding } from 'tiktoken';

const router = express.Router();

const countTokens = text => {
  const encoder = get_encoding('gpt2');
  const tokens = encoder.encode(text);
  return tokens.length;
};

router.post('/count-tokens', express.text(), (req, res) => {
  const text = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const tokenCount = countTokens(text);
    res.status(200).json({ tokenCount });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to count tokens', details: error.message });
  }
});

export default router;
