'use strict';

var assert = require('assert'),
	express = require('express'),
	operationWrapper = require('../../lib/operationWrapper');

describe('complete operations ..', function() {
	describe('full operation test ..', function() {

		var fullDefinition = {
			summary: 'Get all users',
			description: 'List all users and apply optional filter.',
			parameters: [ {
				name: 'username',
				in: 'query',
				type: 'string',
				description: 'Username',
				required: false
			}, {
				name: 'firstname',
				in: 'query',
				type: 'string',
				description: 'Firstname',
				required: false
			}, {
				name: 'lastname',
				in: 'query',
				type: 'string',
				description: 'Lastname',
				required: false
			} ],
			tags: [ 'User' ],
			responses: {
				200: {
					description: 'List of users',
					schema: {
						type: 'array',
						items: {
							$ref: 'User'
						}
					}
				},
				default: {
					description: 'Unexpected error',
					schema: {
						$ref: 'Error'
					}
				}
			}
		};

		var smallDefinition = {
			summary: 'Get all users',
			description: 'List all users and apply optional filter.',
			query: {
				username: { type: String, description: 'Username', required: false },
				firstname: { type: String, description: 'Firstname', required: false },
				lastname: { type: String, description: 'Lastname', required: false }
			},
			tags: 'User',
			responses: {
				200: {
					description: 'List of users',
					schema: {
						type: Array,
						items: {
							$ref: 'User'
						}
					}
				},
				default: {
					description: 'Unexpected error',
					schema: {
						$ref: 'Error'
					}
				}
			}
		};

		it('should keep full definition as it is', function() {
			var spec = operationWrapper(fullDefinition);
			assert.deepEqual(spec, fullDefinition);
		});

		it('should transform small definition to full definition', function() {
			var spec = operationWrapper(smallDefinition);
			console.log(JSON.stringify(spec));
			console.log(JSON.stringify(fullDefinition));
			assert.deepEqual(spec, fullDefinition);
		});
	});
});
