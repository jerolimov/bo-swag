
var methods = require('methods'),
	spec = require('./spec'),
	merge = require('./merge');

/**
 * Wraps an "ExpressJS app" or "ExpressJS Router" instance.
 * Will save the addtional documnetation automatically in the
 * given object and delegates all method calls to the orignal
 * implementation.
 */
module.exports = function boSwagRouterWrapper(router) {

	router._spec = spec();
	router._spec_childrens = {};

	// Bind all methods to the router
	/*for (key in router._spec) {
		if (key !== 'getJSON' && key !== 'toString') {
			router[key] = router._spec[key];
		}
	}*/

	/**
	 * Add an API documentation. First calls #addOperation
	 * with the doc without method, path and the callbacks.
	 *
	 * Then this method calls the origin VERB() method of expressjs.
	 */
	router.api = function boSwagRouterWrapper_api(operation) {
		var method = operation.method.toLowerCase();
		var path = operation.path;
		delete operation.method;
		delete operation.path;

		router._spec.addOperation(method, path, operation);

		if (arguments.length >= 1) {
			var args = Array.prototype.slice.call(arguments);
			args.splice(0, 1);
			router[method].apply(router, args);
		}
		return router;
	};

	/**
	 * Override all methods with an implementation which
	 * supports API documentation.
	 */
	methods.forEach(function(method) {
		var original = router[method];
		router[method] = function boSwagRouterWrapper_verb(path, operation) {
			var args = Array.prototype.slice.call(arguments);
			if (typeof operation === 'object') {
				router._spec.addOperation(method, path, operation);
				args.splice(1, 1);
			}
			if (arguments.length >= 2) {
				original.apply(this, args);
			}
			return router;
		}
	});

	router.getSpecification = function boSwagRouterWrapper_getSpecification() {
		var spec = router._spec.getJSON();

		// Yep. Feel free to improve this code style with map calls. But it works for now. :)
		for (path in router._spec_childrens) {
			var middlewares = router._spec_childrens[path];
			for (var index = 0; index < middlewares.length; index++) {
				var middleware = middlewares[index];
				if (middleware && middleware._spec) {
					var subspec = middleware._spec.getJSON();
					var subpaths = {};
					for (subpath in subspec.paths) {
						subpaths[path + subpath] = subspec.paths[subpath];
					}
					subspec.paths = subpaths;
					spec = merge(spec, subspec);
				}
			}
		}

		return spec;
	};

	var original = router.use;
	/**
	 * Override the user method.
	 *
	 * Path is optional.
	 */
	router.use = function boSwagRouterWrapper_use(path) {
		var args = Array.prototype.slice.call(arguments);
		if (typeof path === 'string') {
			args.splice(0, 1);
		} else {
			path = '';
		}

		// save all middlewares for the path!
		var children = {};
		children[path] = args;
		router._spec_childrens = merge(router._spec_childrens, children);

		return original.apply(router, args);
	};

	return router;
}
