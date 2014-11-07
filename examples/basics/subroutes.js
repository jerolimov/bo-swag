
var express = require('express'),
	swag = require('../..'),
	subroutes = swag.router(express.Router());

subroutes.use('/api', require('./api'));
subroutes.use(require('./api'));

module.exports = subroutes;
