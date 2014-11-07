
var express = require('express');

// You should normally require 'bo-swag' here!
var swag = require('../..');

// This wrapper adds the addtional functiosn to your app!
// All origin functions are still available!!
var app = swag.router(express());

app.use('/routes', require('./routes'));
app.use(require('./routes'));

// Spec basics are still required... We recommend to load this from
// an api.js or spec.js file. Checkout also the basics example.
var spec = require('./spec');

var explorer = express.Router();
explorer.use('/explorer/', swag.middleware(spec, app));

app.use(explorer);

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});
