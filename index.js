/**
 * Export .app() and .router() which wraps an "ExpressJS app"
 * or "ExpressJS Router" instance. Will save the addtional
 * documnetation automatically in the given object and delegates
 * all method calls to the orignal implementation.
 */
module.exports.app = rmodule.exports.router =
	require('./lib/router');

/**
 * Exports an ExpressJS middleware which will automatically
 * generate "only" the "swagger.json" specification.
 */
module.exports.specMiddleware =
	require('./lib/middleware/spec');

/**
 * Exports an ExpressJS middleware which provides the Swagger-UI
 * Explorer interface including an automatically generated
 * "swagger.json" specification.
 */
module.exports.explorerMiddleware =
	require('./lib/middleware/explorer');
