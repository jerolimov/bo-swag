'use strict';

var	assert = require('assert'),
	express = require('express'),
	router = require('../lib/router');

describe('Router', function() {
	var expressRouter;

		// We want NOT test the swagify operation class here!
	var swagifyOperation = function(doc) { return 'OPERATION'; };

	beforeEach(function() {
		expressRouter = router(express.Router());
		expressRouter.swagifyOperation = swagifyOperation;
	});

	it('should have express and api methods defined', function() {
		assert.equal(typeof expressRouter.use, 'function')
		assert.equal(typeof expressRouter.param, 'function')
		assert.equal(typeof expressRouter.route, 'function')
		assert.equal(typeof expressRouter.get, 'function')
		assert.equal(typeof expressRouter.all, 'function')

		assert.equal(typeof expressRouter.api, 'function')
	});

	describe('api call', function() {
		it('should return specification for one api call', function() {
			expressRouter.api({
				method: 'GET',
				path: '/test1'
			});

			var spec = expressRouter.getSpecification();

			assert.deepEqual(spec, {
				'/test1': {
					get: 'OPERATION'
				}
			});
		});

		it('should return specification for two api calls with different method', function() {
			expressRouter.api({
				method: 'GET',
				path: '/test1'
			});
			expressRouter.api({
				method: 'POST',
				path: '/test1'
			});

			var spec = expressRouter.getSpecification();

			assert.deepEqual(spec, {
				'/test1': {
					get: 'OPERATION',
					post: 'OPERATION'
				}
			});
		});

		it('should return specification for two api calls with different path', function() {
			expressRouter.api({
				method: 'GET',
				path: '/test1'
			});
			expressRouter.api({
				method: 'GET',
				path: '/test2'
			});

			var spec = expressRouter.getSpecification();

			assert.deepEqual(spec, {
				'/test1': {
					get: 'OPERATION'
				},
				'/test2': {
					get: 'OPERATION'
				}
			});
		});

		it('should support child router in specification', function() {
			var subRouter1 = router(express.Router()),
				subRouter2 = router(express.Router());

			subRouter1.swagifyOperation = swagifyOperation;
			subRouter2.swagifyOperation = swagifyOperation;

			subRouter1.api({
				method: 'GET',
				path: '/test1'
			});
			subRouter2.api({
				method: 'GET',
				path: '/test2'
			});

			expressRouter.use('/sub1', subRouter1);
			expressRouter.use('/sub2', subRouter2);

			var spec = expressRouter.getSpecification();

			assert.deepEqual(spec, {
				'/sub1/test1': {
					get: 'OPERATION'
				},
				'/sub2/test2': {
					get: 'OPERATION'
				}
			});
		});
	});

	describe('verb calls', function() {
		it('should return specification for one api call', function() {
			expressRouter.get('/test1', {});

			var spec = expressRouter.getSpecification();

			assert.deepEqual(spec, {
				'/test1': {
					get: 'OPERATION'
				}
			});
		});

		it('should return specification for two api calls with different method', function() {
			expressRouter.get('/test1', {});
			expressRouter.post('/test1', {});

			var spec = expressRouter.getSpecification();

			assert.deepEqual(spec, {
				'/test1': {
					get: 'OPERATION',
					post: 'OPERATION'
				}
			});
		});

		it('should return specification for two api calls with different path', function() {
			expressRouter.get('/test1', {});
			expressRouter.get('/test2', {});

			var spec = expressRouter.getSpecification();

			assert.deepEqual(spec, {
				'/test1': {
					get: 'OPERATION'
				},
				'/test2': {
					get: 'OPERATION'
				}
			});
		});

		it('should support child router in specification', function() {
			var subRouter1 = router(express.Router()),
				subRouter2 = router(express.Router());

			subRouter1.swagifyOperation = swagifyOperation;
			subRouter2.swagifyOperation = swagifyOperation;

			subRouter1.get('/test1', {});
			subRouter2.get('/test2', {});

			expressRouter.use('/sub1', subRouter1);
			expressRouter.use('/sub2', subRouter2);

			var spec = expressRouter.getSpecification();

			assert.deepEqual(spec, {
				'/sub1/test1': {
					get: 'OPERATION'
				},
				'/sub2/test2': {
					get: 'OPERATION'
				}
			});
		});
	});

});
