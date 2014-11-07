
var merge = require('./merge'),
	operationWrapper = require('./operationWrapper');

module.exports = function boSwag_spec() {

	var spec = {};

	var json = {
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
	};

	spec.setTitle = function(title) {
		json.info.title = title;
		return spec;
	};

	spec.setContact = function(name, url, email) {
		json.info.contact = {
			name: name,
			url: url,
			email: email
		}
		return spec;
	};

	spec.setLicense = function(name, url) {
		json.info.license = {
			name: name,
			url: url
		}
		return spec;
	}

	spec.setTransportProtocols = function(protocols) {
		json.schemes = protocols;
		return spec;
	};

	spec.addTransportProtocol = function(protocol) {
		json.schemes.push(protocol);
		return spec;
	};

	spec.setConsumeMimeTypes = function(consumes) {
		json.consumes = consumes;
		return spec;
	};

	spec.addConsumeMimeType = function(consume) {
		json.consumes.push(consume);
		return spec;
	};

	spec.setProduceMimeTypes = function(produces) {
		json.produces = produces;
		return spec;
	};

	spec.addProduceMimeType = function(produce) {
		json.produces.push(produce);
		return spec;
	};

	spec.addDefinition = function(name, jsonSchema) {
		var definitions = {};
		definitions[name] = jsonSchema;
		json.definitions = merge(json.definitions, definitions);
		return spec;
	};

	spec.addParameter = function(method, path, parameter) {
		if (parameter) {
			// We have all three arguments
			// => routing parameter
			if (!json.paths[path]) {
				json.paths[path] = {};
			}
			if (!json.paths[path][method]) {
				json.paths[path][method] = {};
			}
			json.paths[path][method] = merge(json.paths[path][method], {
				parameters: [ parameter ]
			});
		} else if (path) {
			// We have two arguments
			// => method is path and path is parameter
			if (!json.paths[method]) {
				json.paths[method] = {};
			}
			json.paths[method] = merge(json.paths[method], {
				parameters: [ path ]
			});
		} else if (method) {
			// We have only one argument
			// => method is parameter
			var parameters = {};
			parameters[method.name] = method;
			json.parameters = merge(json.parameters, parameters);
		}
		return spec;
	};

	spec.addOperation = function(method, path, operation) {
		if (!json.paths[path]) {
			json.paths[path] = {};
		}
		if (!json.paths[path][method]) {
			json.paths[path][method] = {};
		}

		operation = operationWrapper(operation);
		json.paths[path][method] = merge(json.paths[path][method], operation);
		return spec;
	};

	spec.getJSON = function() {
		return json;
	};

	spec.toString = function() {
		return json.toString();
	};

	return spec;
};
