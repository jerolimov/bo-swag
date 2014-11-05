
var path = require('path'),
	serveStatic = require('serve-static');

module.exports = function bo_swag_middleware(spec, router, options) {

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

	var staticFileLookupFolders = [];

	// Optional paramter to override the index.html or other resources.
	if (options && typeof options.overrideUIPath === 'string') {
		staticFileLookupFolders.push(this.options.overrideUIPath);
	}
	staticFileLookupFolders.push(path.join(__dirname, '..', 'public'));
	staticFileLookupFolders.push(path.join(__dirname, '..', 'node_modules', 'swagger-ui', 'dist'));

	console.log('Lookup folders: ' + staticFileLookupFolders);

	return function(req, res, next) {
		console.log(req.path);

		if (req.path === '/swagger.json') {
			spec.paths = router.getSpecification();
			res.json(spec);
			return;
		} else {
			next();
		}
	};
};
