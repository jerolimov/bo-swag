
var path = require('path'),
	serveStatic = require('serve-static');

module.exports = function boSwagExplorerMiddleware(spec, router, options) {

	// If spec is skipped, the spec is like an router.
	if (spec && spec.getSpecification) {
		options = router;
		router = spec;
		spec = {};
	} else if (!spec) {
		spec = {};
	}

	// Extract the router from an expressjs "app"
	/*if (router._router) {
		router = router._router;
	}*/

	var middlewares = [];

	middlewares.push(function(req, res, next) {
		console.log('path: ' + req.path);
		if (req.path === '/swagger.json') {
			res.json(router.getSpecification());
		} else {
			next();
		}
	});

	// Optional paramter to override the index.html or other resources.
	if (options && typeof options.overrideUIPath === 'string') {
		middlewares.push(serveStatic(this.options.overrideUIPath));
	}

	console.log(path.join(__dirname, '..', '..', 'public'));
	console.log(path.join(__dirname, '..', '..', 'node_modules', 'swagger-ui', 'dist'));

	middlewares.push(serveStatic(path.join(__dirname, '..', '..', 'public')));
	middlewares.push(serveStatic(path.join(__dirname, '..', '..', 'node_modules', 'swagger-ui', 'dist')));

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
