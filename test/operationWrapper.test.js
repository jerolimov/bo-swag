'use strict';

var	assert = require('assert'),
	express = require('express'),
	operationWrapper = require('../lib/operationWrapper');

describe('operationWrapper', function() {
	it('should return empty spec for null', function() {
		var spec = operationWrapper();

		assert.deepEqual(spec, {});
	});

	it('should return empty spec for an empty spec', function() {
		var spec = operationWrapper({});

		assert.deepEqual(spec, {});
	});

	it('should return simple spec data', function() {
		var spec = operationWrapper({ summary: 'Summary' });

		assert.deepEqual(spec, {
			summary: 'Summary'
		});
	});

	it('should return body definition if it is a string', function() {
		var spec = operationWrapper({ body: 'Car' });

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
		var spec = operationWrapper({ body: { schema: 'Car', required: false } });

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
