
var methods = require('methods'),
	swagifyOperation = require('../swagify/operation');

/**
 * Wraps an "ExpressJS app" or "ExpressJS Router" instance.
 * Will save the addtional documnetation automatically in the
 * given object and delegates all method calls to the orignal
 * implementation.
 */
module.exports = function bo_swag_router(router) {
	router.swagifyOperation = swagifyOperation;

	/**
	 * Contains swagger API doc for the actual router.
	 */
	router.paths = {};

	router.subRouter = {};

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

			this.addOperation('all', path, doc);
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

				this.addOperation(method, path, doc);
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
		if (typeof path === 'function') {
			middleware = path;
			path = '';
		}
		this.subRouter[path] = middleware;
		return _originalUse.apply(this, arguments);
	}

	router.addOperation = function bo_swag_router_addOperation(method, path, doc) {
		if (!this.paths[path]) {
			this.paths[path] = {};
		}
		this.paths[path][method] = this.swagifyOperation(doc);
	};

	router.getSpecification = function bo_swag_router_getSpecification() {
/*		if (router._router) {
			router = router._router;
		}
*/
		var paths = this.paths;

		for (sub in this.subRouter) {
			if (typeof sub === 'string') {
				var subRouter = this.subRouter[sub];
				if (subRouter && subRouter.getSpecification) {
					var subSpec = subRouter.getSpecification();
					for (var subPath in subSpec) {
						paths[sub + subPath] = subSpec[subPath];
					}
				}
			} else if (typeof sub === 'function') {
				console.log(sub);
				console.log(sub.getSpecification);
			} else {
				console.log(typeof sub);
			}
		}

		return paths;
	};

	return router;
}
