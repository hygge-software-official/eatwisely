export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Invalid input data',
  INTERNAL_SERVER_ERROR: 'An internal server error occurred',
  PAYMENT_NOT_FOUND: 'Payment not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  PAYMENT_ALREADY_PROCESSED: 'Payment has already been processed',
  INVALID_PAYMENT_METHOD: 'Invalid payment method',
  INSUFFICIENT_FUNDS: 'Insufficient funds',
  CURRENCY_NOT_SUPPORTED: 'Currency not supported',
  FEATURE_NOT_AVAILABLE: 'Feature not available',
  INVALID_STATUS: 'Invalid payment status',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const FIELD_NAMES = {
  USER_ID: 'userId',
  CREATED_AT: 'createdAt',
  PAYMENT_ID: 'paymentId',
  AMOUNT: 'amount',
  CURRENCY: 'currency',
  PAYMENT_METHOD: 'paymentMethod',
  PAYMENT_TOKEN: 'paymentToken',
  PRODUCT_ID: 'productId',
  CREDITS_ADDED: 'creditsAdded',
  STATUS: 'status',
  DEVICE_INFO: 'deviceInfo',
  METADATA: 'metadata',
  DEVICE_TYPE: 'type',
  DEVICE_MODEL: 'model',
  DEVICE_OS_VERSION: 'osVersion',
  APP_VERSION: 'appVersion',
};

export const PAYMENT_METHODS = {
  APPLE_PAY: 'ApplePay',
  GOOGLE_PAY: 'GooglePay',
  CREDIT_CARD: 'CreditCard',
};

export const PAYMENT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
};

export const CURRENCY_CODES = {
  USD: 'USD',
  EUR: 'EUR',
};
