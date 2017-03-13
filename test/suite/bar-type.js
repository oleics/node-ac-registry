
var util = require('util');
var FooType = require('./foo-type');

module.exports = BarType;

function BarType(props, options) {
  if(!(this instanceof BarType)) return new BarType(props, options);
  FooType.call(this, props, options)
}

util.inherits(BarType, FooType);
