
var debug = require('debug')('bo-swag:typeWrapper');

module.exports = function boSwagTypeWrapper(type) {
	debug('wrap type', type);

	if (typeof type === 'string') {
		return type;
	}

	if (!type || type === String) {
		return 'string';
	} else if (type === Number) {
		return 'number';
	} else if (type === Array) {
		return 'array';
	} else if (type === Object) {
		return 'object';
	}

	return type;
}
