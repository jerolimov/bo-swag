'use strict';

var	assert = require('assert'),
	express = require('express'),
	pathWrapper = require('../lib/pathWrapper');

describe('pathWrapper', function() {
	it('should return the original path', function() {
		var path = pathWrapper('/path');
		assert.equal(path, '/path');
	});

	it('should format parameter path', function() {
		var path = pathWrapper('/:key');
		assert.equal(path, '/{key}');
	});
});
