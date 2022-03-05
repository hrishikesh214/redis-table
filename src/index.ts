import { RedisClientType } from 'redis';
import {
	RedisTableType,
	RedisTableOptions,
	RedisTableQuery,
	RedisTableSetOptions,
	RedisTableDataObject,
} from './defined';
import { makeRedisTableError, PREFIX } from './utils';
import fetcher from './abstract/fetcher';
import setter from './abstract/setter';

export default class RedisTable implements RedisTableType {
	private _client: RedisClientType; // Redis Client Connection
	private maxConnectTrials: number;

	constructor(client: RedisClientType, options: RedisTableOptions = {}) {
		this._client = client;
		this.maxConnectTrials = options.maxConnectTrials ?? 10;
		this.checkRedisConnection().catch((err) => console.error(err));
	}

	/**
	 *
	 * @param trial {number} - number of trials to connect to Redis
	 * @returns {Promise<boolean>} - true if connected, false if not
	 */
	private async checkRedisConnection(trial: number = 0): Promise<boolean> {
		try {
			await this._client.set(PREFIX + 'test', 'test');
			return true;
		} catch (err) {
			if (trial > this.maxConnectTrials) throw makeRedisTableError('max connect trials limit reached');
			await this._client.connect();
			return await this.checkRedisConnection(trial + 1);
		}
	}

	/**
	 * Quits the Redis client
	 * @returns {Promise<void>}
	 */
	async destroy(): Promise<void> {
		return await this._client.quit();
	}

	/**
	 * @function get from cache
	 * @param {string} cacheName or Table Name
	 * @param {Object} query - query object
	 * @returns {Object}
	 */
	async get(cacheName: string, query: RedisTableQuery = {}): Promise<Object> {
		return await fetcher(this._client, cacheName, query);
	}

	/**
	 *
	 * @param cacheName {string} - cache name
	 * @param data {Object} - data object to save
	 * @param {RedisTableSetOptions} options - cache options
	 * @returns {boolean} - true if saved, false if not
	 */
	async set(cacheName: string, data: RedisTableDataObject, options: RedisTableSetOptions = {}): Promise<boolean> {
		return await setter(this._client, cacheName, data, options);
	}
}

export * from './defined';
