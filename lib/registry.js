
var isString = require('./helper').isString;
var isFunction = require('./helper').isFunction;
var isA = require('./helper').isA;

var RegistryItem = require('./registry-item');

var MixinMixin = require('./mixins/mixin-mixin');
var RelationsMixin = require('./mixins/relations-mixin');
var EachMixin = require('./mixins/each-mixin');
var FilterMixin = require('./mixins/filter-mixin');
var SomeMixin = require('./mixins/some-mixin');
var ReduceMixin = require('./mixins/reduce-mixin');
var HasMixin = require('./mixins/has-mixin');

module.exports = Registry;

Registry.Item = RegistryItem;

function Registry(options) {
  if(!(this instanceof Registry)) return new Registry(options);

  this.Registry = Registry;
  this._types = {};
  this._subtypes = {};
  this._registry = {};
  this._ids = [];
  this._items = [];

  MixinMixin.call(this);
  RelationsMixin.call(this);
  EachMixin.call(this);
  FilterMixin.call(this);
  SomeMixin.call(this);
  ReduceMixin.call(this);
  HasMixin.call(this);
}

// Destructors

Registry.prototype.destroy = function() {
  this.Registry = null;
  this._types = null;
  this._subtypes = null;
  this._registry = null;
  this._ids = null;
  this._items = null;
};

// Types

Registry.prototype.types = function() {
  return Object.keys(this._types);
};

Registry.prototype.setType = function(type, ctor) {
  if(this.typeExists(type)) {
    throw new Error('Type already registered: '+type);
  }
  if(!isFunction(ctor)) {
    throw new Error('Ctor of type "'+type+'" is not a function.');
  }
  this._types[type] = ctor;
};

Registry.prototype.typeExists = function(type) {
  return this._types[type] != null;
};

Registry.prototype.typeCtorExists = function(ctor) {
  return this._types[this.typeOf(ctor)] != null;
};

Registry.prototype.getCtor = function(type) {
  return this._types[type];
};

Registry.prototype.isA = function(ctor, type) {
  var _ctor = this.getCtor(type);
  return ctor === _ctor || isA(ctor, _ctor);
};

Registry.prototype.isType = function(ctor) {
  var types = this.types(), len = types.length, i;
  for(i=0; i<len; i++) {
    if(this.getCtor(types[i]) === ctor) {
      return true;
    }
  }
  return false;
};

Registry.prototype.typeOf = function(ctor) {
  var types = this.types(), len = types.length, i, type;
  for(i=0; i<len; i++) {
    type = types[i];
    if(this.getCtor(type) === ctor) {
      return type;
    }
  }
  for(i=0; i<len; i++) {
    type = types[i];
    if(isA(ctor, this.getCtor(type))) {
      return type;
    }
  }
};

Registry.prototype.typesOf = function(obj) {
  var types = this.types(), len = types.length, i, type, res = [];
  for(i=0; i<len; i++) {
    type = types[i];
    if(this.is(obj, type)) {
      res.push(type);
    }
  }
  return res;
};

Registry.prototype.isAnyType = function(obj) {
  var types = this.types(), len = types.length, i, type, res = [];
  for(i=0; i<len; i++) {
    type = types[i];
    if(this.is(obj, type)) {
      return true;
    }
  }
  return false;
};

Registry.prototype.is = function(objOrId, typeOrCtor) {
  if(this.exists(objOrId)) {
    objOrId = this.get(objOrId);
  }
  if(isFunction(typeOrCtor)) {
    typeOrCtor = this.typeOf(typeOrCtor);
  }
  typeOrCtor = this.getCtor(typeOrCtor);
  if(typeOrCtor == null) {
    throw new Error('Unknown type: '+arguments[0]);
  }
  return objOrId instanceof typeOrCtor;
};

// Instances

Registry.prototype.exists = function(id) {
  return this._registry[id] != null;
};

Registry.prototype.add = function(props, type) {
  var item = new RegistryItem(props, type, this);
  if(this.exists(item.id)) {
    if(item.id === item.props) {
      return item.id;
    }
    throw new Error('Id already exists: '+item.id);
  }
  this._registry[item.id] = item;
  this._ids.push(item.id);
  this._items.push(item);
  return item.id;
};

Registry.prototype.get = function(id) {
  var item = this._registry[id];
  if(item == null) return;
  return item.get();
};

Registry.prototype.remove = function(id) {
  if(this._registry[id] == null) {
    return false;
  }
  delete this._registry[id];
  this._ids.splice(this._ids.indexOf(item.id), 1);
  this._items.splice(this._items.indexOf(item.id), 1);
  this.clearRelations(item.id);
  return true;
};
