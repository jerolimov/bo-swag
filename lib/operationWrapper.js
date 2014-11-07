
var refDefinitionPrefix = '#/definitions/';

module.exports = function boSwagOperationWrapper(operation) {
	operation = operation || {};

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

	return operation;
}
