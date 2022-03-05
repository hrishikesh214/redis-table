# Redis Table

This library is a simple Node Redis Wrapper. It is based on the [Node Redis](https://www.npmjs.com/package/redis) library.

## Getting Started

### Importing the package

```js
import { createClient } from 'redis';
import RedisTable from 'redis-table';
```

### Creating a new client

You have to pass a Redis Client instance to the constructor.

```js
const client = createClient();
const redisTable = new RedisTable(client [, options]);
```

```js
//options can be
{
    maxConnectTrials: 3, // default value is 3
}
```

Well thats enough to setup. now lets see how to set and get values through an example.
suppose you want to cache the `user` Objects.
so you can name a table (cache group) as `users` and get and set values easily, lets see how...

**Note** :
As this library is using redis as a database, there is nothing like a real table or collection, everything is virtual and managed by RedisTable.

## Inserting Values to Table

Suppose you want to cache this user fetched from extreamly slow database.

```js
const user = {
	_id: 1,
	name: 'John',
	age: 30,
	email: 'john@some.com',
	address: {
		street: 'Main Street',
		city: 'Some City',
		state: 'Some State',
		zip: '12345',
	},
};
```

**Note** :
The `_id` is the primary key of the table. Just like MongoDB its necessary to have `_id` as a primary key. Its not generated automatically.

```js
redisTable.set('users', user [, options]);
```

```js
//options can be
{
    expire: 60 * 60 * 1000, //in ms ; default value is 1 minutes
}
```

## Getting Values from Table

```js
const users = redisTable.get('users' [, query]);
```

```js
// response
[
	{
		_id: 1,
		name: 'John',
		age: 30,
		email: 'john@some.com',
		address: {
			street: 'Main Street',
			city: 'Some City',
			state: 'Some State',
			zip: '12345',
		},
	},
    ...
];
```

But wait this will return all the values belonging to the table.

## Quering

### Where clause

Suppose you want to get Object with respect to the `_id`

```js
const user = redisTable.get('users', { where: { _id: 1 } });
```

Or with some parameter

```js
const user = redisTable.get('users', { where: { name: 'John', address: { state: 'State' } } });
```
