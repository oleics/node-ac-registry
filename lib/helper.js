
// Helpers

module.exports = {
  isString: isString,
  isFunction: isFunction,
  isA: isA
};

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

function isFunction(value) {
  return typeof value === 'function' || value instanceof Function;
}

function isA(ctor, superCtor) {
  var super_, stack;
  if(ctor === superCtor) return true;
  super_ = ctor.super_;
  stack = [];
  while(super_) {
    if(stack.indexOf(super_) !== -1) break;
    if(super_ === superCtor) {
      return true;
    }
    stack.push(super_);
    super_ = super_.super_;
  }
  return false;
}
