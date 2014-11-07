
var express = require('express'),
	swag = require('../..'),
	routes = swag.router(express.Router());

routes.use('/api', require('./api'));
routes.use('/route', require('./subroutes'));

module.exports = routes;
