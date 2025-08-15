const isDev = process.env.NODE_ENV === 'development';
console.log('Is Development:', isDev);

export const DEFAULT_CONNECTS = 10;

const getTableName = baseName => (isDev ? `${baseName}_dev` : baseName);

export const USER_SETTINGS_TABLE = getTableName('UserSettings');
export const USER_RECIPES_TABLE = getTableName('UserRecipes');
export const USER_FEEDBACKS_TABLE = getTableName('UserFeedbacks');
export const PAYMENTS_TABLE = getTableName('Payments');

export const SENTRY_DSN = isDev 
? "https://5c1d0bae832203f9c503b0a4c173f412@o4507702686318592.ingest.us.sentry.io/4507707192573952"
: "https://6a156f8302c3bc0c78ee1140b3103980@o4507702686318592.ingest.us.sentry.io/4507854788886528";
