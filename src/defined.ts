interface RedisTableDataObject {
	_id?: string | number;
	[key: string]: any;
}

interface RedisTableOptions {
	maxConnectTrials?: number;
}

interface RedisTableSetOptions {
	expire?: number;
}

interface RedisTableQuery {
	where?: RedisTableDataObject;
	project?: RedisTableDataObject;
	[key: string]: any;
}

interface RedisTableType {
	get(cacheName: string, query: RedisTableQuery): Promise<object>;
	set(cacheName: string, data: RedisTableDataObject, options: RedisTableSetOptions): Promise<boolean>;
	destroy(): Promise<void>;
}

export { RedisTableDataObject, RedisTableOptions, RedisTableQuery, RedisTableType, RedisTableSetOptions };
