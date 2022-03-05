import RedisTable, { RedisTableType } from '../index';
import { createClient, RedisClientType } from 'redis';
const rclient: RedisClientType = createClient();
const rt: RedisTableType = new RedisTable(rclient);

describe('Checking Redis Table', () => {
	test('Get', async () => {
		const testdata = {
			input: {
				cacheName: 'users',
			},
		};
		const result = await rt.get('users', testdata.input);
		// console.log(result);
		expect(result).toBeTruthy();
	});

	test('Get with where', async () => {
		const testdata = {
			input: {
				cacheName: 'users',
				where: {
					_id: 1,
				},
			},
			output: [{ _id: '1', age: 19, name: 'hrishikesh' }],
		};
		const result = await rt.get('users', testdata.input);
		// console.log(result);
		expect(result).toEqual(testdata.output);
	});

	test('Get with where', async () => {
		const testdata = {
			input: {
				cacheName: 'users',
				where: {
					// _id: 1,
					name: 'hrishikesh',
				},
			},
			output: [{ _id: '1', name: 'hrishikesh', age: 19 }],
		};
		const { cacheName, ...query } = testdata.input;
		const result = await rt.get(cacheName, query);
		// console.log(result);
		expect(result).toEqual(testdata.output);
	});

	test('add a row in table', async () => {
		const testdata = {
			input: {
				cacheName: 'users',
				data: {
					_id: 3,
					name: 'parth',
					age: 20,
				},
			},
			output: [{ _id: '3', age: 20, name: 'parth' }],
		};
		const test = await rt.set(testdata.input.cacheName, testdata.input.data, { expire: 5 * 3600 * 1000 });
		// console.log(test);
		const test2 = await rt.get(testdata.input.cacheName, { where: { _id: testdata.input.data._id } });
		// console.log(test2);
		expect(test2).toStrictEqual(testdata.output);
	});
});

afterAll(async () => {
	await rt.destroy();
});
