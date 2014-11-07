
var express = require('express'),
	swag = require('../..'),
	api = swag.router(express.Router());

api.get('/example', {
	summary: 'Just an example'
}, function (req, res) {
	res.send('Hello World!')
});

module.exports = api;
