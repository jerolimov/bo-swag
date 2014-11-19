
var debug = require('debug')('bo-swag:specMiddleware'),
	merge = require('./merge');

module.exports = function boSwagSpecMiddleware() {
	var args = Array.prototype.slice.call(arguments);
	debug('create spec middleware', args.length);

	return function(req, res) {
		var spec = {};
		debug('create spec', spec);

		for (var index = 0; index < args.length; index++) {
			var arg = args[index];
			
//			debug('add spec', index, arg);

			// Extract the router from an expressjs "app"
			/*if (router._router) {
				router = router._router;
			}*/

			if (arg.getJSON) {
				debug('merge spec');
				spec = merge(spec, arg.getJSON());
			} else if (arg.getSpecification) {
				debug('merge router');
				spec = merge(spec, arg.getSpecification());
			} else {
				debug('merge json');
				spec = merge(spec, arg);
			}
		}

//		debug('spec result', spec);
		res.json(spec);
	};
};
