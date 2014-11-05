
var express = require('express'),
	swag = require('../..'),
	router = swag.router(express.Router());

router.use('/subroute', require('./api'));
router.use(require('./api'));

module.exports = router;
