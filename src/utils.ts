export const makeRedisTableError = (message: string) => new Error(`REDIS TABLE ERROR: ${message.toUpperCase()}`);

export const PREFIX = 'RT:';
export const DEFAULT_EXPIRE_TIME = 60 * 60 * 1000;
