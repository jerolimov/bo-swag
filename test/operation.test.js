'use strict';

var	assert = require('assert'),
	express = require('express'),
	swagifyOperation = require('../lib/swagify/operation');

describe('Operation', function() {
	it('should return empty spec for null', function() {
		var spec = swagifyOperation();

		assert.deepEqual(spec, {});
	});

	it('should return empty spec for an empty spec', function() {
		var spec = swagifyOperation({});

		assert.deepEqual(spec, {});
	});

	it('should return simple spec data', function() {
		var spec = swagifyOperation({ summery: 'Summery' });

		assert.deepEqual(spec, {
			summery: 'Summery'
		});
	});

	it('should return body definition if it is a string', function() {
		var spec = swagifyOperation({ body: 'Car' });

		assert.deepEqual(spec, {
			parameters: [ {
				in: 'body',
				name: 'body',
				schema: {
					$ref: '#/definitions/Car'
				}
			} ]
		});
	});

	it('should return body definition if it is an object', function() {
		var spec = swagifyOperation({ body: { schema: 'Car', required: false } });

		assert.deepEqual(spec, {
			parameters: [ {
				in: 'body',
				name: 'body',
				schema: {
					$ref: '#/definitions/Car'
				},
				required: false
			} ]
		});
	});
});
