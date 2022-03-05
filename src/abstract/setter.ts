import { RedisClientType } from 'redis';
import { RedisTableSetOptions, RedisTableDataObject } from '../defined.js';
import { makeRedisTableError, PREFIX, DEFAULT_EXPIRE_TIME } from '../utils.js';

export default async function setter(
	redisClient: RedisClientType,
	cacheName: string,
	data: RedisTableDataObject,
	options: RedisTableSetOptions = {},
): Promise<boolean> {
	if (!Object.keys(data).includes('_id')) throw makeRedisTableError('_id is required');
	if (Object.keys(data).length <= 1) throw makeRedisTableError('data must have at least one field');

	try {
		await redisClient.set(`${PREFIX}${cacheName}:${data._id}`, JSON.stringify(data), {
			PX: options.expire ?? DEFAULT_EXPIRE_TIME,
		});
		return true;
	} catch (err) {
		// throw makeRedisTableError(er);
		// console.error(err);
		return false;
	}
}
