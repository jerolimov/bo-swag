'use strict';

var	assert = require('assert'),
	specMiddleware = require('../lib/specMiddleware'),
	spec = require('../lib/spec'),
	express = require('express'),
	routerWrapper = require('../lib/routerWrapper');

describe('specMiddleware', function() {
	it('should be a function', function() {
		assert.equal(typeof specMiddleware, 'function');
	});

	it('should return also a function (middleware)', function() {
		var middleware = specMiddleware();

		assert.equal(typeof middleware, 'function');
	});

	it('should call res.json with an object without arguments', function() {
		var middleware = specMiddleware();

		var result;

		var req = {};
		var res = { json: function(json) { result = json; } };
		var next = function() {};

		middleware(req, res, next);

		assert.deepEqual(result, {});
	});

	it('should call res.json with an object with json argument', function() {
		var middleware = specMiddleware({ key: 'value' });

		var result;

		var req = {};
		var res = { json: function(json) { result = json; } };
		var next = function() {};

		middleware(req, res, next);

		assert.deepEqual(result, { key: 'value' });
	});

	it('should call res.json with an object with spec argument', function() {
		var middleware = specMiddleware(spec());

		var result;

		var req = {};
		var res = { json: function(json) { result = json; } };
		var next = function() {};

		middleware(req, res, next);

		assert.deepEqual(result, {
			swagger: '2.0',
			info: {},
			schemes: [],
			consumes: [],
			produces: [],
			paths: {},
			definitions: {},
			parameters: {},
			responses: {},
			securityDefinitions: {},
			security: [],
			tags: [],
			externalDocs: {}
		});
	});

	it('should call res.json with an object with router argument', function() {
		var middleware = specMiddleware(routerWrapper(express.Router()));

		var result;

		var req = {};
		var res = { json: function(json) { result = json; } };
		var next = function() {};

		middleware(req, res, next);

		assert.deepEqual(result, {
			swagger: '2.0',
			info: {},
			schemes: [],
			consumes: [],
			produces: [],
			paths: {},
			definitions: {},
			parameters: {},
			responses: {},
			securityDefinitions: {},
			security: [],
			tags: [],
			externalDocs: {}
		});
	});
});
