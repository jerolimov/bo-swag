'use strict';

var	assert = require('assert'),
	merge = require('../lib/merge');

describe('merge', function() {
	it('should return undefined for undefined values', function() {
		var result = merge();
		assert.deepEqual(result, undefined);
	});

	it('should return null for null values', function() {
		var result = merge(null, null);
		assert.deepEqual(result, null);
	});

	it('should return value a if there is no value b', function() {
		var result = merge(23);
		assert.deepEqual(result, 23);
	});

	it('should return value b if there is no value a', function() {
		var result = merge(undefined, 42);
		assert.deepEqual(result, 42);
	});

	it('should merge two arrays', function() {
		var result = merge([1, 2, 3], [4, 5, 6]);
		assert.deepEqual(result, [1, 2, 3, 4, 5, 6]);
	});

	it('should merge two simple objects', function() {
		var result = merge({ a: 1 }, { b: 2 });
		assert.deepEqual(result, { a: 1, b: 2 });
	});

	it('should merge two complex objects', function() {
		var result = merge({ a: [ 1 ] }, { a: [ 2 ] });
		assert.deepEqual(result, { a: [ 1, 2 ] });
	});

	it('should not merge two numbers', function() {
		assert.throws(function() {
			merge(1, 2);
		}, Error);
	})

	it('should not merge two different types', function() {
		assert.throws(function() {
			merge('1', 2);
		}, Error);
	})
});
