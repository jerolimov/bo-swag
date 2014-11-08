
var express = require('express'),
	swag = require('../..'),
	api = swag.router(express.Router());

api._spec.addDefinition('Car', {
	title: 'Cars',
	type: 'object',
	properties: {
		manufacturer: { type: String },
		model: { type: String }
	}
});

api.get('/example', {
	summary: 'Just an example'
}, function (req, res) {
	res.send('Hello World!')
});

api.post('/api', {
	summary: 'Just an example',
	body: 'Car'
}, function (req, res) {
	res.send('Hello World!')
})

module.exports = api;
