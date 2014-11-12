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

	it('should transform query parameter with one type-only parameter', function() {
		var spec = operationWrapper({ query: { param1: String }});

		assert.deepEqual(spec, {
			parameters: [ {
				in: 'query',
				name: 'param1',
				type: 'string'
			} ]
		});
	});

	it('should transform query parameter with two type-only parameters', function() {
		var spec = operationWrapper({ query: { param1: String, param2: Date }});

		assert.deepEqual(spec, {
			parameters: [ {
				in: 'query',
				name: 'param1',
				type: 'string'
			}, {
				in: 'query',
				name: 'param2',
				type: 'string',
				format: 'date-time'
			} ]
		});
	});

	it('should transform query parameter with more definitions', function() {
		var spec = operationWrapper({ query: {
			param1: { type: String, required: true },
			param2: { type: Date, required: true },
			param3: { type: Date, format: 'date', required: true }
		}});

		assert.deepEqual(spec, {
			parameters: [ {
				in: 'query',
				name: 'param1',
				type: 'string',
				required: true
			}, {
				in: 'query',
				name: 'param2',
				type: 'string',
				format: 'date-time',
				required: true
			}, {
				in: 'query',
				name: 'param3',
				type: 'string',
				format: 'date',
				required: true
			} ]
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
