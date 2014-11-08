
// You should normally require 'bo-swag' here!
var swag = require('../..');

var spec = swag.spec();

spec.setTitle('Just another awesome API...');

// Or just export { title: "..." }

module.exports = spec;
