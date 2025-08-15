/**
 * Обробляє помилки Clerk та повертає зрозуміле повідомлення про помилку.
 * @param {Object} error - Об'єкт помилки від Clerk.
 * @returns {string} Повідомлення про помилку.
 */
export function handleClerkError(error) {
  if (error?.errors?.length) {
    return error.errors
      .map(err => err.longMessage)
      .filter(Boolean)
      .join(', ');
  }
  return 'Internal Server Error';
}