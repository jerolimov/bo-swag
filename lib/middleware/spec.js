
module.exports = function bo_swag_middleware_spec(spec, router) {

	// If spec is skipped, the spec is like an router.
	if (spec && spec.getSpecification) {
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
		spec.paths = router.getSpecification();
		res.json(spec);
	};
};
