
var express = require('express'),
	swag = require('../..'),
	router = swag.router(express.Router());

router.use('/route', require('./subroutes'));

module.exports = router;
