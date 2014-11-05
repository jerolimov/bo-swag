
var methods = require('methods'),
	merge = require('../swagify/merge'),
	swagifyOperation = require('../swagify/operation');

/**
 * Wraps an "ExpressJS app" or "ExpressJS Router" instance.
 * Will save the addtional documnetation automatically in the
 * given object and delegates all method calls to the orignal
 * implementation.
 */
module.exports = function bo_swag_wrapper_router(router) {

	router.swagifyOperation = swagifyOperation;

	/**
	 * Save a new sub router to aggregate the documation later.
	 *
	 * See also getSubSpecifications below.
	 */
	router._swag_addSubRouter = function bo_swag_wrapper_router_addSubRouter(path, subRouter) {
		if (typeof path == 'function') {
			subRouter = path;
			path = '';
		} else if (!subRouter) {
			return;
		}
		if (!router._swag_subRouter) {
			router._swag_subRouter = {};
		}
		if (!router._swag_subRouter[path]) {
			router._swag_subRouter[path] = [];
		}
		router._swag_subRouter[path].push(subRouter);
	};

	/**
	 * Get all sub routers specifications to aggregate their
	 * documentation.
	 *
	 * See also addSubRouter above.
	 */
	router._swag_getSubSpecifications = function bo_swag_wrapper_router_getSubSpecifications() {
		if (!router._swag_subRouter) {
			return {};
		}
		var subSpecifications = {};
		for (var path in router._swag_subRouter) {
			var subRouter = router._swag_subRouter[path];
			for (var i = 0; i < subRouter.length; i++) {
				if (subRouter[i] && subRouter[i].getSpecification) {
					var subSpec = subRouter[i].getSpecification();
					subSpecifications[path] = subSpec;
				}
			}
		}
		return subSpecifications;
	};

	router.addOperation = function bo_swag_wrapper_router_addOperation(method, path, doc) {
		if (!router._swag_paths[path]) {
			router._swag_paths[path] = {};
		}
		router._swag_paths[path][method] = router.swagifyOperation(doc);
	};

	router.getSpecification = function bo_swag_wrapper_router_getSpecification() {
		/*if (router._router) {
			router = router._router;
		}*/

		var paths = router._swag_paths;

		console.log(router._swag_getSubSpecifications());


		for (sub in router.subRouter) {
			if (typeof sub === 'string') {
				var subRouter = router.subRouter[sub];
			} else if (typeof sub === 'function') {
				console.log(sub);
				console.log(sub.getSpecification);
			} else {
				console.log(typeof sub);
			}
		}

		return paths;
	};

	/**
	 * Add an API documentation. First calls #addOperation with the doc
	 * without method, path and the callbacks.
	 *
	 * Then this method calls the origin VERB() method of expressjs.
	 */
	router.api = function bo_swag_router_api(doc) {
		var method = doc.method.toLowerCase();
		var path = doc.path;
		delete doc.method;
		delete doc.path;

		// TODO change to apply later!
		return this[method].call(this, path, doc);
	};

	var _originalAll = router.all;
	router.all = function bo_swag_router_all_wrapper(path, doc) {
		if (typeof doc === 'object') {
			var callback = doc.callback;
			delete doc.callback;

			router.addOperation('all', path, doc);
			if (callback) {
				_originalAll.call(this, callback);
			}
			return router;
		} else {
			return _originalAll.apply(this, arguments);
		}
	}

	methods.forEach(function(method) {
		var _originalCall = router[method];
		router[method] = function bo_swag_router_VERB_wrapper(path, doc) {
			if (typeof doc === 'object') {
				var callback = doc.callback;
				delete doc.callback;

				router.addOperation(method, path, doc);
				if (callback) {
					_originalCall.call(this, callback);
				}
				return router;
			} else {
				return _originalCall.apply(this, arguments);
			}
		}
	});

	var _originalUse = router.use;
	router.use = function bo_swag_router_use_wrapper(path, middleware) {

		router._swag_addSubRouter(path, middleware);

		return _originalUse.apply(this, arguments);
	};

	return router;
}
