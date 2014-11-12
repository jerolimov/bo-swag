
var express = require('express');

// You should normally require 'bo-swag' here!
var swag = require('../..');

// This wrapper adds the addtional functiosn to your app!
// All origin functions are still available!!
var app = swag.router(express());

// Standard calls of .get, .post, etc. are still working as expected.
// But they will generate NO API documentation automatically.
app.get('/', function (req, res) {
	res.send('Hello World!')
})

// If a object is provided after the path an API doc will be generated!
app.get('/api', { summary: 'Just an example' }, function (req, res) {
	res.send('Hello World!')
})

// Recommended formatting if you need more (and you will..) than one
// attribute. This exmaple shows also how you can use simplified
// documetation attributes.
//
// { body: 'A String' } will be automatically expanded to
// { parameters: [ {
//     in: 'body',
//     name: 'body',
//     schema: { $ref: '#/definitions/A String' }
// } ]
app.post('/api', {
	summary: 'Just an example',
	body: 'Car'
}, function (req, res) {
	res.send('Hello World!')
})

// Spec basics are still required... We recommend to load this from
// an api.js or spec.js file. Checkout also the basics example.
var spec = swag.spec();
spec.setTitle('Just another awesome API...');
spec.addDefinition('Car', {
	title: 'Cars',
	type: 'object',
	properties: {
		manufacturer: { type: String },
		model: { type: String }
	}
});

app.use('/explorer', swag.swaggerUI(spec, app));

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});
