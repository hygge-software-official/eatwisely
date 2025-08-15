import { ERROR_MESSAGES, FIELD_NAMES } from './const.js';

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP'];
const SUPPORTED_PAYMENT_METHODS = ['ApplePay', 'GooglePay', 'CreditCard'];
const SUPPORTED_STATUSES = ['completed', 'pending', 'failed'];

export function validatePaymentInput(data) {
  const errors = [];

  if (!data[FIELD_NAMES.USER_ID] || typeof data[FIELD_NAMES.USER_ID] !== 'string') {
    errors.push({ field: FIELD_NAMES.USER_ID, message: ERROR_MESSAGES.INVALID_INPUT });
  }

  if (!data[FIELD_NAMES.CREATED_AT] || typeof data[FIELD_NAMES.CREATED_AT] !== 'number' || data[FIELD_NAMES.CREATED_AT] <= 0) {
    errors.push({ field: FIELD_NAMES.CREATED_AT, message: ERROR_MESSAGES.INVALID_INPUT });
  }

  if (!data[FIELD_NAMES.PAYMENT_ID] || typeof data[FIELD_NAMES.PAYMENT_ID] !== 'string') {
    errors.push({ field: FIELD_NAMES.PAYMENT_ID, message: ERROR_MESSAGES.INVALID_INPUT });
  }

  if (!data[FIELD_NAMES.AMOUNT] || typeof data[FIELD_NAMES.AMOUNT] !== 'number' || data[FIELD_NAMES.AMOUNT] <= 0) {
    errors.push({ field: FIELD_NAMES.AMOUNT, message: ERROR_MESSAGES.INVALID_INPUT });
  }

  if (!data[FIELD_NAMES.CURRENCY] || !SUPPORTED_CURRENCIES.includes(data[FIELD_NAMES.CURRENCY])) {
    errors.push({ field: FIELD_NAMES.CURRENCY, message: ERROR_MESSAGES.CURRENCY_NOT_SUPPORTED });
  }

  if (!data[FIELD_NAMES.PAYMENT_METHOD] || !SUPPORTED_PAYMENT_METHODS.includes(data[FIELD_NAMES.PAYMENT_METHOD])) {
    errors.push({ field: FIELD_NAMES.PAYMENT_METHOD, message: ERROR_MESSAGES.INVALID_PAYMENT_METHOD });
  }

  if (!data[FIELD_NAMES.PAYMENT_TOKEN] || typeof data[FIELD_NAMES.PAYMENT_TOKEN] !== 'string') {
    errors.push({ field: FIELD_NAMES.PAYMENT_TOKEN, message: ERROR_MESSAGES.INVALID_INPUT });
  }

  if (!data[FIELD_NAMES.PRODUCT_ID] || typeof data[FIELD_NAMES.PRODUCT_ID] !== 'string') {
    errors.push({ field: FIELD_NAMES.PRODUCT_ID, message: ERROR_MESSAGES.INVALID_INPUT });
  }

  if (!data[FIELD_NAMES.CREDITS_ADDED] || typeof data[FIELD_NAMES.CREDITS_ADDED] !== 'number' || data[FIELD_NAMES.CREDITS_ADDED] <= 0) {
    errors.push({ field: FIELD_NAMES.CREDITS_ADDED, message: ERROR_MESSAGES.INVALID_INPUT });
  }

  if (!data[FIELD_NAMES.STATUS] || !SUPPORTED_STATUSES.includes(data[FIELD_NAMES.STATUS])) {
    errors.push({ field: FIELD_NAMES.STATUS, message: ERROR_MESSAGES.INVALID_STATUS });
  }

  if (data[FIELD_NAMES.DEVICE_INFO]) {
    if (typeof data[FIELD_NAMES.DEVICE_INFO] !== 'object' || 
        !data[FIELD_NAMES.DEVICE_INFO].type || 
        !data[FIELD_NAMES.DEVICE_INFO].model || 
        !data[FIELD_NAMES.DEVICE_INFO].osVersion) {
      errors.push({ field: FIELD_NAMES.DEVICE_INFO, message: ERROR_MESSAGES.INVALID_INPUT });
    }
  }

  if (data[FIELD_NAMES.METADATA]) {
    if (typeof data[FIELD_NAMES.METADATA] !== 'object') {
      errors.push({ field: FIELD_NAMES.METADATA, message: ERROR_MESSAGES.INVALID_INPUT });
    }
  }

  return errors;
}

export function validateUserId(userId) {
  if (typeof userId !== 'string' || userId.trim() === '') {
    return false;
  }

  const userIdRegex = /^user_[a-zA-Z0-9]{20,}$/;
  return userIdRegex.test(userId);
}