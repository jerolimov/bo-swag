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

	it('should return String for string', function() {
		var type = typeWrapper(String);
		assert.equal(type, 'string');
	});
});
