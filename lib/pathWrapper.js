
var debug = require('debug')('bo-swag:pathWrapper');

module.exports = function boSwagPathWrapper(path) {
	debug('wrap path', path);

	path = path.replace(/:([A-Za-z]+)/g, '{$1}');

	return path;
};
