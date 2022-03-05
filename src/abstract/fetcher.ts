import { RedisClientType } from 'redis';
import { RedisTableQuery } from '../defined.js';
import { PREFIX } from '../utils.js';

const flattenObj = (obj: any, parent: string = '', res: object = {}) => {
	obj = obj;
	for (const key of Object.keys(obj)) {
		const propName = parent ? parent + '.' + key : key;
		if (typeof (obj as any)[key] === 'object') {
			flattenObj((obj as any)[key], propName, res);
		} else {
			(res as any)[propName] = (obj as any)[key];
		}
	}
	return res;
};

export default async function dataFetcher(
	redisClient: RedisClientType,
	cacheName: string,
	query: RedisTableQuery,
): Promise<object> {
	const matcherString: string = `*${PREFIX}${cacheName}:${query.where?._id ?? ''}*`;
	// console.log(matcherString);
	const keys: string[] = await redisClient.keys(matcherString);
	// console.log(keys);
	if (keys.length === 0) return [];
	let vals: any[] = await redisClient.sendCommand(['MGET', ...keys]);
	vals = vals.map((item: any) => {
		if (item === null) return null;
		return JSON.parse(item);
	});
	let data = keys.map((key: string, index: number) => {
		return {
			...vals[index],
			_id: key.split(':').at(-1),
		};
	});
	query.where = flattenObj(query.where ?? {});
	// console.log(query.where);
	const qwl: number = Object.keys(query.where).length;
	if (!!(query.where as any)._id ? qwl >= 2 : qwl >= 1) {
		data = data.filter((d: any) => {
			d = flattenObj(d);
			let show = true;
			for (const key of Object.keys(query.where as any)) {
				// console.log(key, (query.where as any)[key], d[key]);
				if (d[key] !== (query.where as any)[key]) {
					show = false;
					break;
				}
			}
			return show;
		});
	}

	return data;
}
