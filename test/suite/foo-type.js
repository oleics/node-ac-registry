
module.exports = FooType;

function FooType(props, options) {
  if(!(this instanceof FooType)) return new FooType(props, options);
  if(props == null) props = {};
  this.id = props.id;
  this.options = options;
}
