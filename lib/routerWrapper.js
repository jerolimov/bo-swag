
var debug = require('debug')('bo-swag:routerWrapper'),
	methods = require('methods'),
	spec = require('./spec'),
	merge = require('./merge'),
	pathWrapper = require('./pathWrapper');

/**
 * Wraps an "ExpressJS app" or "ExpressJS Router" instance.
 * Will save the addtional documnetation automatically in the
 * given object and delegates all method calls to the orignal
 * implementation.
 */
module.exports = function boSwagRouterWrapper(router) {
	debug('wrap router');

	router._spec = spec();
	router._spec_childrens = {};

	// Bind all methods to the router
	for (var key in router._spec) {
		if (key !== 'getJSON' && key !== 'toString') {
			router[key] = router._spec[key];
		}
	}

	/**
	 * Override all methods with an implementation which
	 * supports API documentation.
	 */
	methods.forEach(function(method) {
		var original = router[method];
		router[method] = function boSwagRouterWrapper_verb(path, operation) {
			var args = Array.prototype.slice.call(arguments);

			if (typeof operation === 'object') {
				debug('router.' + method + ' called with path ' + path);
				router._spec.addOperation(method, path, operation);
				args.splice(1, 1);
			}

			return original.apply(router, args);
		};
	});

	/**
	 * Add an API documentation. First calls #addOperation
	 * with the doc without method, path and the callbacks.
	 *
	 * Then this method calls the origin VERB() method of expressjs.
	 */
	router.api = function boSwagRouterWrapper_api(operation) {
		var args = Array.prototype.slice.call(arguments);
		debug('router.api called');

		var method = operation.method.toLowerCase();
		var path = operation.path;
		delete operation.method;
		delete operation.path;

		router._spec.addOperation(method, path, operation);

		if (args.length >= 2) {
			args[0] = path;
			return router[method].apply(router, args);
		} else {
			return router;
		}
	};

	/**
	 * Override the use method.
	 *
	 * Path is optional.
	 */
	var original = router.use;
	router.use = function boSwagRouterWrapper_use(path) {
		var middlewares, args = Array.prototype.slice.call(arguments);

		if (typeof path === 'string') {
			middlewares = args.slice(1);
		} else {
			middlewares = args;
			path = '';
		}

		debug('router.use called with path ' + path + ' and ' + middlewares.length + ' middlewares');

		// save all middlewares for the path!
		var children = {};
		children[path] = middlewares;
		router._spec_childrens = merge(router._spec_childrens, children);

		return original.apply(router, args);
	};

	router.getSpecification = function boSwagRouterWrapper_getSpecification() {
		var spec = router._spec.getJSON();
//		debug('build spec with local json', spec);

		// Yep. Feel free to improve this code style with map calls. But it works for now. :)
		for (var path in router._spec_childrens) {
			var middlewares = router._spec_childrens[path];
//			debug('lookup middlewares for path ' + path + ' and ' + middlewares.length + ' middlewares');
			for (var index = 0; index < middlewares.length; index++) {
				var middleware = middlewares[index];
				if (middleware && middleware.getSpecification) {
					var subspec = merge({}, middleware.getSpecification());
//					debug('found middleware with path ' + path + ' and subspec: ' + JSON.stringify(subspec));

					var subpaths = subspec.paths;
					subspec.paths = {};

					for (var subpath in subpaths) {
						subspec.paths[path + subpath] = subpaths[subpath];
					}

					spec = merge(spec, subspec);
				}
			}
		}

		return spec;
	};

	return router;
};
