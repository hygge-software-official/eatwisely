const isDev = process.env.NODE_ENV === 'development';
console.log(isDev);

export async function checkHealth() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    isDev,
  };
}
