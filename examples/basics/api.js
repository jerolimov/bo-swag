
var express = require('express'),
	swag = require('../..'),
	router = swag.router(express.Router());

router.get('/', {
	summary: 'Just an example'
}, function (req, res) {
	res.send('Hello World!')
});

module.exports = router;
