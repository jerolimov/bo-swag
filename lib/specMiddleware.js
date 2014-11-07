
var path = require('path'),
	serveStatic = require('serve-static');

module.exports = function boSwagSpecMiddleware(spec, router, options) {

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

	return function(req, res, next) {
		res.json(router.getSpecification());
	};
};
