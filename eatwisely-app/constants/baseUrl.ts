export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.EXPO_PUBLIC_API_BASE_URL
    : process.env.EXPO_PUBLIC_API_BASE_URL_DEV;
