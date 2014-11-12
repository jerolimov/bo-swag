
var debug = require('debug')('bo-swag:typeWrapper');

module.exports = function boSwagTypeWrapper(type) {
	debug('wrap type', type);

	if (typeof type === 'string') {
		return { type: type };
	}

	if (!type || type === String) {
		return { type: 'string' };
	} else if (type === Number) {
		return {type: 'number' };
	} else if (type === Boolean) {
		return {type: 'boolean' };
	} else if (type === Array) {
		return { type: 'array' };
	} else if (type === Object) {
		return { type: 'object' };
	} else if (type === Date) {
		return { type: 'string', format: 'date-time' };
	}

	throw new Error('Unexpected type: ' + type);
}
