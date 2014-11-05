'use strict';

var	assert = require('assert'),
	spec = require('../../lib/wrapper/spec');

describe('spec', function() {

	it('should return an empty spec', function() {
		var api = spec();

		assert.deepEqual({
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
		}, api.getJSON());
	});

	it('should implement toString', function() {
		var api = spec();

		assert.equal({
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
		}.toString(), api.toString());
	});

	it('should allow setting some metadata', function() {
		var api = spec();
		api.setTitle('Awesome API');
		api.setContact('Name', 'URL', 'email');
		api.setLicense('Name', 'URL');

		assert.deepEqual({
			swagger: '2.0',
			info: {
				title: 'Awesome API',
				contact: {
					name: 'Name',
					url: 'URL',
					email: 'email'
				},
				license: {
					name: 'Name',
					url: 'URL'
				}
			},
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
		}, api.getJSON());
	});

	it('should allow setting the transport scheme', function() {
		var api = spec();
		api.setTransportProtocols([ 'http' ]);
		api.addTransportProtocol('https');

		assert.deepEqual({
			swagger: '2.0',
			info: {},
			schemes: [ 'http', 'https' ],
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
		}, api.getJSON());
	});

	it('should allow setting the consume mime types', function() {
		var api = spec();
		api.setConsumeMimeTypes([ 'application/json' ]);
		api.addConsumeMimeType('text/plain');

		assert.deepEqual({
			swagger: '2.0',
			info: {},
			schemes: [],
			consumes: [ 'application/json', 'text/plain' ],
			produces: [],
			paths: {},
			definitions: {},
			parameters: {},
			responses: {},
			securityDefinitions: {},
			security: [],
			tags: [],
			externalDocs: {}
		}, api.getJSON());
	});

	it('should allow setting the produce mime types', function() {
		var api = spec();
		api.setProduceMimeTypes([ 'application/json' ]);
		api.addProduceMimeType('text/plain');

		assert.deepEqual({
			swagger: '2.0',
			info: {},
			schemes: [],
			consumes: [],
			produces: [ 'application/json', 'text/plain' ],
			paths: {},
			definitions: {},
			parameters: {},
			responses: {},
			securityDefinitions: {},
			security: [],
			tags: [],
			externalDocs: {}
		}, api.getJSON());
	});

	it('should allow adding a definition', function() {
		var api = spec();

		api.addDefinition('Car', {
			title: 'Cars',
			type: 'object',
			properties: {
				manufacturer: { type: String },
				model: { type: String }
			}
		});

		api.addDefinition('Manufacturer', {
			title: 'Manufacturers',
			type: 'object',
			properties: {
				name: { type: String }
			}
		});

		assert.deepEqual({
			swagger: '2.0',
			info: {},
			schemes: [],
			consumes: [],
			produces: [],
			paths: {},
			definitions: {
				Car: {
					title: 'Cars',
					type: 'object',
					properties: {
						manufacturer: { type: String },
						model: { type: String }
					}
				},
				Manufacturer: {
					title: 'Manufacturers',
					type: 'object',
					properties: {
						name: { type: String }
					}
				}
			},
			parameters: {},
			responses: {},
			securityDefinitions: {},
			security: [],
			tags: [],
			externalDocs: {}
		}, api.getJSON());
	});

	it('should allow adding a parameter with full route', function() {
		var api = spec();

		api.addParameter('get', '/v1', { name: 'param1' });
		api.addParameter('get', '/v1', { name: 'param2' });

		assert.deepEqual({
			swagger: '2.0',
			info: {},
			schemes: [],
			consumes: [],
			produces: [],
			paths: {
				'/v1': {
					get: {
						parameters: [
							{ name: 'param1' },
							{ name: 'param2' }
						]
					}
				}
			},
			definitions: {},
			parameters: [],
			responses: {},
			securityDefinitions: {},
			security: [],
			tags: [],
			externalDocs: {}
		}, api.getJSON());
	});

	it('should allow adding a parameter with path only', function() {
		var api = spec();

		api.addParameter('/1', { name: 'param1' });
		api.addParameter('/2', { name: 'param2' });
		api.addParameter('/2', { name: 'param3' });

		assert.deepEqual({
			swagger: '2.0',
			info: {},
			schemes: [],
			consumes: [],
			produces: [],
			paths: {
				'/1': {
					parameters: [
						{ name: 'param1' }
					]
				},
				'/2': {
					parameters: [
						{ name: 'param2' },
						{ name: 'param3' }
					]
				}
			},
			definitions: {},
			parameters: {},
			responses: {},
			securityDefinitions: {},
			security: [],
			tags: [],
			externalDocs: {}
		}, api.getJSON());
	});

	it('should allow adding a parameter without path', function() {
		var api = spec();

		api.addParameter({ name: 'param1' });
		api.addParameter({ name: 'param2' });
		api.addParameter({ name: 'param3' });

		assert.deepEqual({
			swagger: '2.0',
			info: {},
			schemes: [],
			consumes: [],
			produces: [],
			paths: {},
			definitions: {},
			parameters: {
				'param1': { name: 'param1' },
				'param2': { name: 'param2' },
				'param3': { name: 'param3' }
			},
			responses: {},
			securityDefinitions: {},
			security: [],
			tags: [],
			externalDocs: {}
		}, api.getJSON());
	});

	it('should allow adding no parameter', function() {
		var api = spec();

		api.addParameter();

		assert.deepEqual({
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
		}, api.getJSON());
	});

	it('should allow adding a parameter without path', function() {
		var api = spec();

		api.addOperation('get', '/v1', { summary: 'Summary1' });
		api.addOperation('get', '/v2', { summary: 'Summary2' });
		api.addOperation('post', '/v1', { summary: 'Summary3' });
		api.addOperation('post', '/v1', { description: 'Desc' });

		assert.deepEqual({
			swagger: '2.0',
			info: {},
			schemes: [],
			consumes: [],
			produces: [],
			paths: {
				'/v1': {
					get: { summary: 'Summary1' },
					post: { summary: 'Summary3', description: 'Desc' }
				},
				'/v2': {
					get: { summary: 'Summary2' }
				}
			},
			definitions: {},
			parameters: {},
			responses: {},
			securityDefinitions: {},
			security: [],
			tags: [],
			externalDocs: {}
		}, api.getJSON());
	});

});
