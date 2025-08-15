export const ANDROID_PLATFORM_ARN =
  'arn:aws:sns:us-east-1:767397662013:app/GCM/eatwisely-android';

export const IOS_PLATFORM_ARN =
  'arn:aws:sns:us-east-1:767397662013:app/APNS/eatwisely-ios';

export const ERROR_MESSAGES = {
  USER_ID_REQUIRED: 'userId is required',
  CONNECTS_REQUIRED: 'userId and subtractCount are required',
  INVALID_CONNECTS: 'Connects must be a non-negative number',
  USER_SETTINGS_NOT_FOUND: 'User settings not found',
  UNEXPECTED_FORMAT: 'Unexpected format received from getUserList()',
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
