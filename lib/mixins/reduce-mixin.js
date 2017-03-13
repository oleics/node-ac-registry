
var isFunction = require('../helper').isFunction;

module.exports = ReduceMixin;

function ReduceMixin() {

  this.reduce = reduce;

  function reduce(type, pid, fn, initValue, scope) {
    // args: [type, [pid, ]] fn, initValue, scope
    var argslen = arguments.length;
    if(argslen === 1) {
      fn = type;
      type = null;
    } else if(argslen === 2) {
      if(isFunction(pid)) {
        fn = pid;
        pid = null;
      } else {
        scope = fn;
        initValue = pid;
        fn = type;
        type = null;
        pid = null;
      }
    } else if(argslen === 3) {
      if(isFunction(pid)) {
        initValue = fn;
        fn = pid;
        pid = null;
      } else {
        scope = fn;
        initValue = pid;
        fn = type;
        type = null;
        pid = null;
      }
    } else if(argslen === 4 && isFunction(pid)) {
      scope = initValue;
      initValue = fn;
      fn = pid;
      pid = null;
    }
    if(scope == null) scope = this;
    if(type != null && isFunction(type)) {
      type = this.typeOf(type);
    }
    if(pid != null && pid.id != null) {
      pid = pid.id;
    }

    // reduce
    var len = this._ids.length, index, id, obj;
    if(type != null && pid != null) {
      for(index=0; index<len; index++) {
        if(this._items[index].type === type) {
          id = this._ids[index];
          if(this.isChildOf(id, pid)) {
            initValue = fn.call(scope, initValue, this.get(id));
          }
        }
      }
    } else if(type != null) {
      for(index=0; index<len; index++) {
        if(this._items[index].type === type) {
          initValue = fn.call(scope, initValue, this.get(this._ids[index]));
        }
      }
    } else if(pid != null) {
      for(index=0; index<len; index++) {
        id = this._ids[index];
        if(this.isChildOf(id, pid)) {
          initValue = fn.call(scope, initValue, this.get(id));
        }
      }
    } else {
      for(index=0; index<len; index++) {
        initValue = fn.call(scope, initValue, this.get(this._ids[index]));
      }
    }
    return initValue;
  }

}
