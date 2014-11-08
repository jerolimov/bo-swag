
var path = require('path'),
	debug = require('debug')('bo-swag:explorerMiddleware'),
	serveStatic = require('serve-static'),
	specMiddleware = require('./specMiddleware');

module.exports = function boSwagExplorerMiddleware() {
	var args = Array.prototype.slice.call(arguments);
	debug('create explorer middleware', args.length);
	
	var middleware = specMiddleware.apply(null, args);

	var middlewares = [];

	middlewares.push(function(req, res, next) {
		if (req.path === '/swagger.json') {
			middleware(req, res, next);
		} else {
			next();
		}
	});

	middlewares.push(serveStatic(path.join(__dirname, '..', 'public')));
	middlewares.push(serveStatic(path.join(__dirname, '..', 'node_modules', 'swagger-ui', 'dist')));

	return function(req, res, next) {
		var index = 0;
		var loop = function() {
			console.log('run ' + index);
			if (middlewares[index]) {
				middlewares[index++](req, res, loop);
			} else {
				next();
			}
		};
		loop();
	};
};
