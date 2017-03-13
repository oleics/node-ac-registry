
var pluralize = require('pluralize');

module.exports = MixinMixin;

function MixinMixin() {
  var registry = this;

  this.mixin = mixin;

  function mixin(type) {
    var self = this;
    var fnName = type.slice(0, 1).toUpperCase() + type.slice(1);

    // add
    self['add'+fnName] = function(props) {
      return registry.addChildTo(registry.add(props, type), self);
    };

    // has
    self['has'+fnName] = function() {
      return registry.has(self, type);
    };

    // each
    self['each'+fnName] = function(fn, scope) {
      return registry.each(type, self, fn, scope);
    };

    // filter
    self['filter'+fnName] = function(fn, scope) {
      return registry.filter(type, self, fn, scope);
    };

    // some
    self['some'+fnName] = function(fn, scope) {
      return registry.some(type, self, fn, scope);
    };

    // reduce
    self['reduce'+fnName] = function(fn, initValue, scope) {
      return registry.reduce(type, self, fn, initValue, scope);
    };
  };
}
