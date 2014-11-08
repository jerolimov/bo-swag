
module.exports.spec = require('./lib/spec');

/**
 * Export .app() and .router() which wraps an "ExpressJS app"
 * or "ExpressJS Router" instance. Will save the addtional
 * documnetation automatically in the given object and delegates
 * all method calls to the orignal implementation.
 */
module.exports.app =
module.exports.router =
module.exports.wrap = require('./lib/routerWrapper');

/**
 * Exports an ExpressJS middleware which will automatically
 * generate "only" the "swagger.json" specification.
 */
module.exports.specMiddleware = require('./lib/specMiddleware');

/**
 * Exports an ExpressJS middleware which provides the Swagger-UI
 * Explorer interface including an automatically generated
 * "swagger.json" specification.
 */
module.exports.swaggerUI =
module.exports.explorerMiddleware = require('./lib/explorerMiddleware');
