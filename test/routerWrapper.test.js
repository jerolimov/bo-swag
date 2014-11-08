'use strict';

var	assert = require('assert'),
	express = require('express'),
	routerWrapper = require('../lib/routerWrapper');

describe('routerWrapper', function() {
	var router;

	beforeEach(function() {
		router = routerWrapper(express.Router());
	});

	it('should have express and api methods defined', function() {
		assert.equal(typeof router.use, 'function')
		assert.equal(typeof router.param, 'function')
		assert.equal(typeof router.route, 'function')
		assert.equal(typeof router.get, 'function')
		assert.equal(typeof router.all, 'function')

		assert.equal(typeof router.api, 'function')
	});

	describe('api call', function() {
		it('should return specification for one api call', function() {
			router.api({
				method: 'GET',
				path: '/test1'
			});

			var spec = router.getSpecification();

			assert.deepEqual(spec, {
				swagger: '2.0',
				info: {},
				schemes: [],
				consumes: [],
				produces: [],
				paths: {
					'/test1': {
						get: {}
					}
				},
				definitions: {},
				parameters: {},
				responses: {},
				securityDefinitions: {},
				security: [],
				tags: [],
				externalDocs: {}
			});
		});

		it('should return specification for two api calls with different method', function() {
			router.api({
				method: 'GET',
				path: '/test1'
			});
			router.api({
				method: 'POST',
				path: '/test1'
			});

			var spec = router.getSpecification();

			assert.deepEqual(spec, {
				swagger: '2.0',
				info: {},
				schemes: [],
				consumes: [],
				produces: [],
				paths: {
					'/test1': {
						get: {},
						post: {}
					}
				},
				definitions: {},
				parameters: {},
				responses: {},
				securityDefinitions: {},
				security: [],
				tags: [],
				externalDocs: {}
			});
		});

		it('should return specification for two api calls with different path', function() {
			router.api({
				method: 'GET',
				path: '/test1'
			});
			router.api({
				method: 'GET',
				path: '/test2'
			});

			var spec = router.getSpecification();

			assert.deepEqual(spec, {
				swagger: '2.0',
				info: {},
				schemes: [],
				consumes: [],
				produces: [],
				paths: {
					'/test1': {
						get: {}
					},
					'/test2': {
						get: {}
					}
				},
				definitions: {},
				parameters: {},
				responses: {},
				securityDefinitions: {},
				security: [],
				tags: [],
				externalDocs: {}
			});
		});

		it('should support child router in specification', function() {
			var subRouter1 = routerWrapper(express.Router()),
				subRouter2 = routerWrapper(express.Router());

			subRouter1.api({
				method: 'GET',
				path: '/test1'
			});
			subRouter2.api({
				method: 'GET',
				path: '/test2'
			});

			router.use('/sub1', subRouter1);
			router.use('/sub2', subRouter2);

			var spec = router.getSpecification();

			assert.deepEqual(spec, {
				swagger: '2.0',
				info: {},
				schemes: [],
				consumes: [],
				produces: [],
				paths: {
					'/sub1/test1': {
						get: {}
					},
					'/sub2/test2': {
						get: {}
					}
				},
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

	describe('verb calls', function() {
		it('should return specification for one api call', function() {
			router.get('/test1', {}, function(req, res, next) { next(); });

			var spec = router.getSpecification();

			assert.deepEqual(spec, {
				swagger: '2.0',
				info: {},
				schemes: [],
				consumes: [],
				produces: [],
				paths: {
					'/test1': {
						get: {}
					}
				},
				definitions: {},
				parameters: {},
				responses: {},
				securityDefinitions: {},
				security: [],
				tags: [],
				externalDocs: {}
			});
		});

		it('should return specification for two api calls with different method', function() {
			router.get('/test1', {}, function(req, res, next) { next(); });
			router.post('/test1', {}, function(req, res, next) { next(); });

			var spec = router.getSpecification();

			assert.deepEqual(spec, {
				swagger: '2.0',
				info: {},
				schemes: [],
				consumes: [],
				produces: [],
				paths: {
					'/test1': {
						get: {},
						post: {}
					}
				},
				definitions: {},
				parameters: {},
				responses: {},
				securityDefinitions: {},
				security: [],
				tags: [],
				externalDocs: {}
			});
		});

		it('should return specification for two api calls with different path', function() {
			router.get('/test1', {}, function(req, res, next) { next(); });
			router.get('/test2', {}, function(req, res, next) { next(); });

			var spec = router.getSpecification();

			assert.deepEqual(spec, {
				swagger: '2.0',
				info: {},
				schemes: [],
				consumes: [],
				produces: [],
				paths: {
					'/test1': {
						get: {}
					},
					'/test2': {
						get: {}
					}
				},
				definitions: {},
				parameters: {},
				responses: {},
				securityDefinitions: {},
				security: [],
				tags: [],
				externalDocs: {}
			});
		});

		it('should support child router in specification', function() {
			var subRouter1 = routerWrapper(express.Router()),
				subRouter2 = routerWrapper(express.Router());

			subRouter1.get('/test1', {}, function(req, res, next) { next(); });
			subRouter2.get('/test2', {}, function(req, res, next) { next(); });

			router.use('/sub1', subRouter1);
			router.use('/sub2', subRouter2);

			var spec = router.getSpecification();

			assert.deepEqual(spec, {
				swagger: '2.0',
				info: {},
				schemes: [],
				consumes: [],
				produces: [],
				paths: {
					'/sub1/test1': {
						get: {}
					},
					'/sub2/test2': {
						get: {}
					}
				},
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

});
