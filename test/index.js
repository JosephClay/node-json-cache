import test from 'tape';
import jsonCache from '../';

// can't get at the errors if we enable ejection
const config = { ejectable: false };

test('keys', assert => {
	const cache = jsonCache('.cache/demo1', config);

	cache.setItem('demo', 1);
	assert.equal(cache.getItem('demo'), 1, 'string works as key');
	
	cache.setItem('demo 2', 1);
	assert.equal(cache.getItem('demo 2'), 1, 'string with spaces works as key');
	
	cache.setItem('demo@3!', 1);
	assert.equal(cache.getItem('demo@3!'), 1, 'string with specials works as key');

	cache.setItem(4, 1);
	assert.equal(cache.getItem(4), 1, 'number cast to string works as key');

	const objKey = { toString: () => 'demo4' };
	cache.setItem(objKey, 1);
	assert.equal(cache.getItem(objKey), 1, 'object with toString method works as key');

	assert.end();
});

test('read/write values', assert => {
	const cache = jsonCache('.cache/demo1', config);

	assert.test('string', assert => {
		cache.setItem('demo', 'basic');
		assert.equal(cache.getItem('demo'), 'basic', 'string works as value');

		cache.setItem('demo', 'value with spaces');
		assert.equal(cache.getItem('demo'), 'value with spaces', 'string with spaces works as value');

		cache.setItem('demo', 'value with specials/$@#$@#$@#$\\#$@#$@#$@#$@#$@#$#$');
		assert.equal(cache.getItem('demo'), 'value with specials/$@#$@#$@#$\\#$@#$@#$@#$@#$@#$#$', 'string with specials works as value');
		
		assert.end();
	});
	
	assert.test('number', assert => {
		cache.setItem('demo', 322);
		assert.equal(cache.getItem('demo'), 322, 'number works as value');
	
		assert.end();
	});

	assert.test('float number', assert => {
		cache.setItem('demo', 322.666);
		assert.equal(cache.getItem('demo'), 322.666, 'float works as value');
	
		assert.end();
	});

	assert.test('boolean', assert => {
		cache.setItem('demo', true);
		assert.equal(cache.getItem('demo'), true, 'true works as value');
		
		cache.setItem('demo', false);
		assert.equal(cache.getItem('demo'), false, 'false works as value');
		
		assert.end();
	});

	assert.test('array', assert => {
		const arr = [1, 2, 3];
		cache.setItem('demo', arr);
		assert.ok(Array.isArray(cache.getItem('demo')), 'array works as value');
		assert.equal(cache.getItem('demo')[0], 1, 'array value persisted');
		assert.equal(cache.getItem('demo')[1], 2, 'array value persisted');
		assert.equal(cache.getItem('demo')[2], 3, 'array value persisted');

		assert.end();
	});

	assert.test('object', assert => {
		const obj = { one: 1, two: 2, three: 3 };
		cache.setItem('demo', obj);
		assert.ok(typeof cache.getItem('demo') === 'object', 'object works as value');
		assert.equal(cache.getItem('demo').one, 1, 'object value persisted');
		assert.equal(cache.getItem('demo').two, 2, 'object value persisted');
		assert.equal(cache.getItem('demo').three, 3, 'object value persisted');
	
		assert.end();
	});

	assert.test('invalid params', assert => {
		assert.throws(() => cache.getItem(), 'getItem without a key throws');
		assert.throws(() => cache.setItem(undefined, 1), 'setItem without a key throws');

		assert.end();
	});
});

test('complex operations', assert => {
	const cache = jsonCache('.cache/demo2', config);

	const arr = [1, 2, 3];
	cache.setItem('demo', arr);
	assert.equal(cache.getItem('demo'), arr, 'array maintains reference equality');
	
	const obj = { one: 1, two: 2, three: 3 };
	cache.setItem('demo', obj);
	assert.equal(cache.getItem('demo'), obj, 'object maintains reference equality');

	assert.end();
});

test('operations with stored objects', assert => {
	const cache = jsonCache('.cache/demo3', config);
	const array = [1, 2, 3];
	const object = { one: 1, two: 2, three: 3 };

	cache.setItem('array example', array);
	cache.setItem('object example', object);

	array.push(4);
	assert.equal(cache.getItem('array example'), array, 'can push value to array');
	cache.save();
	
	object.four = 4;
	assert.equal(cache.getItem('object example'), object, 'can set new value in object');
	cache.save();

	assert.end();
});

test('get/set', assert => {
	const cache = jsonCache('.cache/demo4', config);

	cache.setItem('demo', 1);
	assert.equal(cache.get().demo, 1, 'can get store to access value');
	
	cache.setItem('hello', 'world');
	cache.set({ demo: 2 });
	assert.equal(cache.get().demo, 2, 'can set store to assign values');
	assert.equal(cache.get().hello, undefined, 'setting store clears values');

	assert.throws(() => cache.set(), 'setting without a value throws');

	assert.end();
});

test('clear', assert => {
	const cache = jsonCache('.cache/demo5', config);

	cache.setItem('demo', 1);
	assert.equal(cache.getItem('demo'), 1, 'ensure value is set');
	cache.clear();
	assert.equal(cache.getItem('demo'), undefined, 'value is cleared');
	assert.equal(Object.keys(cache.get()).length, 0, 'no keys exist in cache');
	
	assert.end();
});
