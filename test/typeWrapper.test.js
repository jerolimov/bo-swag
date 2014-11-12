'use strict';

var assert = require('assert'),
	express = require('express'),
	typeWrapper = require('../lib/typeWrapper');

describe('typeWrapper', function() {
	it('should return undefined for undefined', function() {
		var type = typeWrapper();
		assert.equal(type, 'string');
	});

	it('should return null for null', function() {
		var type = typeWrapper(null);
		assert.equal(type, 'string');
	});

	it('should return string for string', function() {
		var type = typeWrapper('string');
		assert.equal(type, 'string');
	});

	it('should return string for String', function() {
		var type = typeWrapper(String);
		assert.equal(type, 'string');
	});

	it('should return number for Number', function() {
		var type = typeWrapper(Number);
		assert.equal(type, 'number');
	});

	it('should return array for Array', function() {
		var type = typeWrapper(Array);
		assert.equal(type, 'array');
	});

	it('should return object for Object', function() {
		var type = typeWrapper(Object);
		assert.equal(type, 'object');
	});
});
