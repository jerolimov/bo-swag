# bo-swag [![Build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url] [![Dependency Status][dependency-image]][dependency-url]

## A lightweight solution to create swagger documentation with ExpressJS

Status: **Work in progress**

## Installation

	npm install bo-swag --save

## DRY.

Just wrap your ExpressJS app or router. All origin functions are still available!!

```js
var express = require('express'),
	swag = require('bo-swag'),
	app = swag.wrap(express());
```

Standard call of .get, .use. or other verbs works as expected and generate NO API doc for you:

```js
app.get('/', function (req, res) {
	res.send('Hello World!')
})
```

But if you provide a small documentation hint this project will automatically generate an API doc for you:

```js
// Name => Standard JSON-scheme
app.addDefinition('Car', {
	title: 'Cars',
	type: Object,
	properties: {
		manufacturer: { type: String },
		model: { type: String }
	}
});

app.get('/cars', { response: 'Cars' }, function (req, res) {
	// ...
})
app.post('/cars', { body: 'Car' }, function (req, res) {
	// ...
})
```

This exmaple show how you can use multiple attributs. Expect
some shortcuts like `body` you can use all swagger documentation
attributes here!

Shortcuts? Yes! `body: 'A String'` is a shortcut and will be
automatically expanded to `parameters: [ { in: 'body', name: 'body', schema: { $ref: '#/definitions/A String' } } ]`.

```js
app.post('/api', {
	summary: 'Just an example',
	body: 'Example'
}, function (req, res) {
	res.send('Hello World!')
})
```

If you want load your definitions from an external spec
javascript or json file, you can merge your input easily:

```js
app.spec.load(require('./spec.js'));
```

To include the swagger-ui (static HTML and a dynamically
generated swagger.json) just include the middleware.

```js
app.use('/explorer', swag.middleware(spec, app));
```


[travis-image]: https://img.shields.io/travis/jerolimov/bo-swag/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/jerolimov/bo-swag
[coveralls-image]: https://img.shields.io/coveralls/jerolimov/bo-swag/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/jerolimov/bo-swag
[dependency-image]: http://img.shields.io/david/jerolimov/bo-swag.svg?style=flat-square
[dependency-url]: https://david-dm.org/jerolimov/bo-swag
