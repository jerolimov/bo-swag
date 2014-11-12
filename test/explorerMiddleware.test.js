'use strict';

var	assert = require('assert'),
	explorerMiddleware = require('../lib/explorerMiddleware');

describe('explorerMiddleware', function() {
	it('should be a function', function() {
		assert.equal(typeof explorerMiddleware, 'function');
	});

	it('should return also a function (middleware)', function() {
		var middleware = explorerMiddleware();

		assert.equal(typeof middleware, 'function');
	});

	it('should call res.json with an object', function() {
		var middleware = explorerMiddleware();

		var result;

		var req = {};
		var res = { json: function(json) { result = json; } };
		var next = function() {};
		
		middleware(req, res, next);
	});
});
