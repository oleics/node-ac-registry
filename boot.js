
var isArray = require('ac-is-array');
var isScalar = require('is-scalar');
var merge = require('ac-merge');
var gRegistry = require('ac-registry');
var createLogger = require('ac-log');

module.exports = boot;

function boot(options) {
  if(options == null) options = {};
  if(options.registry == null) options.registry = gRegistry;
  if(options.types == null) options.types = {};
  if(options.instances == null) options.instances = [];
  if(options.env == null) options.env = process.env.NODE_ENV || 'default';
  if(!isArray(options.instances)) options.instances = [options.instances];

  var log = createLogger('boot');
  var started = new Date();

  var registry = options.registry;
  var types = options.types;
  var instances = options.instances;
  var env = options.env;
  var bootOptions = {
    registry: registry
  };

  // Registers types for instances
  Object.keys(types).map(function(type){
    return {
      type: type,
      ctor: types[type]
    };
  }).map(function(d){
    if(typeof d.ctor !== 'function') {
      d.ctor = require(d.ctor);
    }
    return d;
  }).forEach(function(d){
    registry.setType(d.type, d.ctor);
  });

  // Creates instances
  var stack = instances.map(function(props){
    if(props.environments != null && props.environments[env] != null) {
      props = merge(props, props.environments[env]);
    }
    return props;
  }).map(function(props){
    var d = {};
    d.props = getBootOptions(props, ['bootOptions', 'postBootOptions'], props.id);
    d.id = registry.add(d.props);
    d.obj = registry.get(d.id);
    return d;
  });

  var promise = Promise.resolve(stack);

  // Call .boot
  promise = promise.then(function(){
    var promise = Promise.resolve();
    log.info('BOOT');
    stack.filter(function(d){
      return d.obj.boot != null;
    }).map(function(d){
      promise = promise.then(function(){
        log.info('"%s" boot ...', d.id);
        return d.obj.boot(getBootOptions(d.props.bootOptions, null, d.props.id)).then(function(obj){
          d.obj = obj || d.obj;
          return d;
        });
      });
    });
    return promise;
  });

  // Call .postBoot
  promise = promise.then(function(){
    var promise = Promise.resolve();
    log.info('POST BOOT');
    stack.filter(function(d){
      return d.obj.postBoot != null;
    }).map(function(d){
      promise = promise.then(function(){
        log.info('"%s" post-boot ...', d.id);
        return d.obj.postBoot(getBootOptions(d.props.postBootOptions, null, d.props.id)).then(function(obj){
          d.obj = obj || d.obj;
          return d;
        });
      });
    });
    return promise;
  });

  // Log finish
  promise = promise.then(function(){
    log.info('It took %s seconds to boot %s instances.', (Date.now()-started)/1000, stack.length);
    return stack;
  });

  return promise;

  function getBootOptions(bootOptions, skip, prefix) {
    if(bootOptions == null) return null;
    if(skip == null) skip = [];
    if(prefix == null) prefix = '';

    if(isScalar(bootOptions)) {
      if(registry.exists(bootOptions)) {
        log.info('"%s" > "%s"', prefix, bootOptions);
        return registry.get(bootOptions);
      }
      return bootOptions;
    } else if(typeof bootOptions === 'function') {
      return bootOptions;
    } else if(!isArray(bootOptions) && registry.isAnyType(bootOptions)) {
      return bootOptions;
    }

    // if(bootOptions.id != null) {
    //   if(registry.exists(bootOptions.id)) {
    //     if(registry.isAnyType(bootOptions)) {
    //       return bootOptions;
    //     }
    //     return registry.get(bootOptions.id);
    //   }
    //   if(bootOptions.type != null && registry.typeExists(bootOptions.type)) {
    //     return registry.get(registry.add(bootOptions));
    //   }
    // }

    var key;
    for(key in bootOptions) {
      if(key !== 'id' && key !== 'type' && skip.indexOf(key) === -1 && bootOptions.hasOwnProperty(key)) {
        bootOptions[key] = getBootOptions(bootOptions[key], skip, prefix+'.'+key);
      }
    }

    return bootOptions;
  }
}
