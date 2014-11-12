'use strict';

var assert = require('assert'),
	express = require('express'),
	typeWrapper = require('../lib/typeWrapper');

describe('typeWrapper', function() {
	it('should return string for undefined', function() {
		var type = typeWrapper();
		assert.deepEqual(type, { type: 'string' });
	});

	it('should return string for null', function() {
		var type = typeWrapper(null);
		assert.deepEqual(type, { type: 'string' });
	});

	it('should return string for string', function() {
		var type = typeWrapper('string');
		assert.deepEqual(type, { type: 'string' });
	});

	it('should return number for number', function() {
		var type = typeWrapper('number');
		assert.deepEqual(type, { type: 'number' });
	});

	it('should return string for String', function() {
		var type = typeWrapper(String);
		assert.deepEqual(type, { type: 'string' });
	});

	it('should return number for Number', function() {
		var type = typeWrapper(Number);
		assert.deepEqual(type, { type: 'number' });
	});

	it('should return boolean for Boolean', function() {
		var type = typeWrapper(Boolean);
		assert.deepEqual(type, { type: 'boolean' });
	});

	it('should return array for Array', function() {
		var type = typeWrapper(Array);
		assert.deepEqual(type, { type: 'array' });
	});

	it('should return object for Object', function() {
		var type = typeWrapper(Object);
		assert.deepEqual(type, { type: 'object' });
	});

	it('should return date-time for Date', function() {
		var type = typeWrapper(Date);
		assert.deepEqual(type, { type: 'string', format: 'date-time' });
	});

	it('should throw error for unsupported type', function() {
		assert.throws(function() {
			typeWrapper(1234);
		}, Error);
	});
});
