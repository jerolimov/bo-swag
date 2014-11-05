# API documentation with swagger for ExpressJS...

**Work in Process**

## DRY.

Just wrap your ExpressJS app or router. All origin functions are still available!!

```js
var express = require('express'),
	swag = require('bo-swag'),
	app = swag.router(express());
```

Standard call of .get still works and generate NO API doc

```js
app.get('/', function (req, res) {
	res.send('Hello World!')
})
```

If a object is provided after the path an API doc will be generated:

```js
app.addDefinition('Car', {
	title: 'Cars',
	type: 'object',
	properties: {
		manufacturer: { type: String },
		model: { type: String }
	}
});

app.get('/cars', { response: 'Cars' }, function (req, res) {
	res.send('Hello World!')
})
app.post('/cars', { body: 'Car' }, function (req, res) {
	res.send('Hello World!')
})
```

Recommended formatting if you need more (and you will..) than one
attribute. This exmaple shows also how you can use simplified
documetation attributes.

And yes, `body: 'A String'` will be automatically expanded to `parameters: [ { in: 'body', name: 'body', schema: { $ref: '#/definitions/A String' } } ]`

```js
app.post('/api', {
	summary: 'Just an example',
	body: 'Example'
}, function (req, res) {
	res.send('Hello World!')
})
```

To include the swagger-ui (static HTML and a dynamically generated swagger.json) just include
the middleware. The spec basics are still required...

We recommend to load this from an api.js or spec.js file. Checkout also the basics example.

```js
var spec = require('./spec.js');
app.use('/explorer', swag.middleware(spec, app));
```
