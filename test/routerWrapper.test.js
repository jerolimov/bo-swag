'use strict';

var	assert = require('assert'),
	express = require('express'),
	routerWrapper = require('../lib/routerWrapper');

describe('routerWrapper', function() {
	var router, getArguments;

	beforeEach(function() {
		router = express.Router();
		router.get = function() { getArguments = arguments; };
		router = routerWrapper(router);

		getArguments = undefined;
	});

	it('should have express and api methods defined', function() {
		assert.equal(typeof router.use, 'function');
		assert.equal(typeof router.param, 'function');
		assert.equal(typeof router.route, 'function');
		assert.equal(typeof router.get, 'function');
		assert.equal(typeof router.all, 'function');
		assert.equal(typeof router.api, 'function');
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

		it('should support child router in specification without path', function() {
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

			router.use(subRouter1);
			router.use(subRouter2);

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

		it('should support child router in specification with path', function() {
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

		it('should not call origin router method', function() {
			router.api({
				method: 'GET',
				path: '/test1'
			});

			assert.equal(null, getArguments);
		});

		it('should call origin router method with one middleware', function() {
			var middleware1 = function() {};
			router.api({
				method: 'GET',
				path: '/test1'
			}, middleware1);

			assert.equal(2, getArguments.length);
			assert.equal('/test1', getArguments[0]);
			assert.equal(middleware1, getArguments[1]);
		});

		it('should call origin router method with two middlewares', function() {
			var middleware1 = function() {}, middleware2 = function() {};
			router.api({
				method: 'GET',
				path: '/test1'
			}, middleware1, middleware2);

			assert.equal(3, getArguments.length);
			assert.equal('/test1', getArguments[0]);
			assert.equal(middleware1, getArguments[1]);
			assert.equal(middleware2, getArguments[2]);
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

		it('should add operation and not call origin router method', function() {
			router.get('/test1', {});

			assert.equal(1, getArguments.length);
			assert.equal('/test1', getArguments[0]);
		});

		it('should add operation and call origin router method with one middleware', function() {
			var middleware1 = function() {};
			router.get('/test1', {}, middleware1);

			assert.equal(2, getArguments.length);
			assert.equal('/test1', getArguments[0]);
			assert.equal(middleware1, getArguments[1]);
		});

		it('should add operation and call origin router method with two middlewares', function() {
			var middleware1 = function() {}, middleware2 = function() {};
			router.get('/test1', {}, middleware1, middleware2);

			assert.equal(3, getArguments.length);
			assert.equal('/test1', getArguments[0]);
			assert.equal(middleware1, getArguments[1]);
			assert.equal(middleware2, getArguments[2]);
		});

		it('should not no router method', function() {
			router.get('/test1');

			assert.equal(1, getArguments.length);
			assert.equal('/test1', getArguments[0]);
		});

		it('should call only origin router method with one middleware', function() {
			var middleware1 = function() {};
			router.get('/test1', middleware1);

			assert.equal(2, getArguments.length);
			assert.equal('/test1', getArguments[0]);
			assert.equal(middleware1, getArguments[1]);
		});

		it('should call only origin router method with two middlewares', function() {
			var middleware1 = function() {}, middleware2 = function() {};
			router.get('/test1', middleware1, middleware2);

			assert.equal(3, getArguments.length);
			assert.equal('/test1', getArguments[0]);
			assert.equal(middleware1, getArguments[1]);
			assert.equal(middleware2, getArguments[2]);
		});
	});
});
