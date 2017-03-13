
var cuid = require('cuid');
var isString = require('./helper').isString;
var isFunction = require('./helper').isFunction;

module.exports = RegistryItem;

function RegistryItem(props, options, registry) {
  if(!(this instanceof RegistryItem)) return new RegistryItem(props, options, registry);

  if(registry == null) registry = registrySingleton();

  if(props == null) props = {};

  if(options == null) options = props.options;
  if(isString(options)) {
    if(isString(options)) {
      this.type = options;
    } else {
      props.type = options;
    }
    options = null;
  }

  this.registry = registry;
  this.type = props.type || this.type;
  this.ctor = props.ctor; // || this.registry.getCtor(this.type);
  this.id = props.id;
  this.options = options;
  this.props = props;

  this._resolve();
  // console.log('new: %s [%s(%s)]', this.id, this.type, this.ctor ? this.ctor.name : '');
}

RegistryItem.prototype.get = function() {
  var type = this.type;
  var ctor = this.ctor;
  var props = this.props;
  var options = this.options;

  if(ctor == null) ctor = this.ctor = props.constructor;
  if(type == null) type = this.type = this.registry.typeOf(ctor);

  if(type == null) {
    throw new Error('Unknown type');
  }

  if(!(props instanceof ctor)) {
    if(isString(props)) {
      props = {id: props};
    }
    // console.log('create: %s [%s(%s)]', this.id, type, ctor.name, props);
    if(options == null) {
      props = new ctor(props);
    } else {
      props = new ctor(props, options);
    }
  }

  if(props.type == null) {
    props.type = this.type;
  }
  if(props.id == null) {
    props.id = this.id;
  }
  this.props = props;

  return props;
};

RegistryItem.prototype._resolve = function() {
  var registry = this.registry;
  var type = this.type;
  var ctor = this.ctor;
  var id = this.id;
  var options = this.options;
  var props = this.props;
  var tmp;

  while(true) {
    if(isString(ctor)) {
      ctor = require(ctor);
    } else if(isString(props)) {
      if(registry.typeExists(props)) {
        type = props;
        if(ctor == null) ctor = registry.getCtor(type);
        props = null;
        break;
      } else {
        try {
          props = require(props);
        } catch(ex) {
          // might be an id
          id = props;
          // props = {
          //   type: type,
          //   id: id
          // };
          break;
        }
      }
    } else if(isFunction(props)) {
      if(registry.isType(props)) {
        type = registry.typeOf(props);
        ctor = props;
        props = {};
      } else {
        props = props(options);
      }
    } else if(props == null) {
      break;
    } else if(ctor != null && props instanceof ctor) {
      break;
    } else if(props.type != null) {
      type = props.type;
      delete props.type;
      if(ctor == null) ctor = registry.getCtor(type);
    } else if(ctor == null && type != null) {
      options = props.options || props;
      id = props.id || id;
      break;
    } else {
      options = props.options || props;
      id = props.id || id;
      if(ctor == null) ctor = props.constructor;
      if(ctor != null) type = registry.typeOf(ctor);
      break;
    }
  }

  if(ctor != null && type != null) {
    if(!registry.isA(ctor, type)) {
      throw new Error('Ctor is not a type of '+type);
    }
  } else if(type != null) {
    ctor = registry.getCtor(type);
  } else if(ctor != null) {
    type = registry.typeOf(ctor);
  }

  if(type == null) {
    throw new Error('Unknown type');
  }
  if(ctor == null) {
    throw new Error('Unknown ctor for type: '+type);
  }

  this.type = type;
  this.ctor = ctor;

  this.id = id || cuid();
  this.options = options;
  this.props = props;
};
