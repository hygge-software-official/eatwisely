/**
 * Validates the input data for feedback submission.
 * 
 * @param {string} userId - The user's identifier.
 * @param {number} rating - The feedback rating (integer from 1 to 5).
 * @param {string} message - The feedback message text.
 * @returns {Object|null} An object containing validation errors, or null if validation passes.
 */
export function validateFeedbackInput(userId, rating, message) {
  const errors = {};

  if (!isValidUserId(userId)) errors.userId = 'Invalid or missing user ID';
  if (!isValidRating(rating)) errors.rating = 'Rating must be an integer between 1 and 5';
  if (!isValidMessage(message)) errors.message = 'Invalid or missing message';

  return Object.keys(errors).length > 0 ? errors : null;
}

function isValidUserId(userId) {
  return userId && typeof userId === 'string';
}

function isValidRating(rating) {
  return typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

function isValidMessage(message) {
  return message && typeof message === 'string';
}