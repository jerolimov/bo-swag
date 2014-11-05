
var refDefinitionPrefix = '#/definitions/';

module.exports = function(doc) {
	doc = doc || {};

	if (doc.body) {
		var body = doc.body;
		delete doc.body;

		if (!doc.parameters) doc.parameters = [];

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
			throw new Error('Unsupported body type ' + typeof body + ' in api doc for ' + method + ' ' + path);
		}

		doc.parameters.push(body);
	}

	return doc;
}
