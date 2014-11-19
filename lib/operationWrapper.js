
var debug = require('debug')('bo-swag:operationWrapper'),
	merge = require('./merge'),
	typeWrapper = require('./typeWrapper');

var refDefinitionPrefix = '#/definitions/';

module.exports = function boSwagOperationWrapper(operation) {
	debug('wrap', operation);

	operation = operation || {};

	if (operation.query) {
		if (!operation.parameters) operation.parameters = [];

		for (var name in operation.query) {
			if (typeof operation.query[name] === 'object') {
				var parameter = typeWrapper(operation.query[name].type);
				delete operation.query[name].type;
				if (operation.query[name].format) {
					parameter.format = operation.query[name].format;
					delete operation.query[name].format;
				}
				parameter.name = name;
				parameter.in = 'query';
				operation.parameters.push(merge(parameter, operation.query[name]));
			} else {
				var parameter = typeWrapper(operation.query[name]);
				parameter.name = name;
				parameter.in = 'query';
				operation.parameters.push(parameter);
			}
		}

		delete operation.query;
	}

	if (operation.body) {
		var body = operation.body;
		delete operation.body;

		if (!operation.parameters) operation.parameters = [];

		if (typeof body === 'string') {
			body = {
				in: 'body',
				name: 'body',
				schema: {
					$ref: refDefinitionPrefix + body
				}
			};
		} else if (typeof body === 'object') {
			if (!body.in) body.in = 'body';
			if (!body.name) body.name = 'body';
			if (typeof body.schema === 'string') {
				body.schema = {
					$ref: refDefinitionPrefix + body.schema
				}
			}
		} else {
			throw new Error('Unsupported body type ' + typeof body + ' in api operation for ' + method + ' ' + path);
		}

		operation.parameters.push(body);
	}

	if (operation.responses) {
		for (var responseCode in operation.responses) {
			var response = operation.responses[responseCode];
			if (response.schema) {
				var type = typeWrapper(response.schema.type);
				response.schema.type = type;
			}
		}
	}

	if (typeof operation.tags === 'string') {
		operation.tags = [ operation.tags ];
	}

	return operation;
}
