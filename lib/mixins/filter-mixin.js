
var isFunction = require('../helper').isFunction;

module.exports = FilterMixin;

function FilterMixin() {

  this.filter = filter;

  function filter(type, pid, fn, scope) {
    // args: [type, [pid, ]] fn, scope
    var argslen = arguments.length;
    if(argslen === 1) {
      fn = type;
      type = null;
    } else if(argslen === 2) {
      if(isFunction(pid)) {
        fn = pid;
        pid = null;
      } else {
        fn = type;
        type = null;
        scope = pid;
        pid = null;
      }
    } else if(argslen === 3) {
      if(!isFunction(fn)) {
        scope = fn;
        fn = pid;
        pid = null;
      }
    }
    if(scope == null) scope = this;
    if(type != null && isFunction(type)) {
      type = this.typeOf(type);
    }
    if(pid != null && pid.id != null) {
      pid = pid.id;
    }

    // filter
    var len = this._ids.length, index, id, obj, results = [];
    if(type != null && pid != null) {
      for(index=0; index<len; index++) {
        if(this._items[index].type === type) {
          id = this._ids[index];
          if(this.isChildOf(id, pid)) {
            obj = this.get(id);
            if(fn.call(scope, obj) === true) {
              results.push(obj);
            }
          }
        }
      }
    } else if(type != null) {
      for(index=0; index<len; index++) {
        if(this._items[index].type === type) {
          obj = this.get(this._ids[index]);
          if(fn.call(scope, obj) === true) {
            results.push(obj);
          }
        }
      }
    } else if(pid != null) {
      for(index=0; index<len; index++) {
        id = this._ids[index];
        if(this.isChildOf(id, pid)) {
          obj = this.get(id);
          if(fn.call(scope, obj) === true) {
            results.push(obj);
          }
        }
      }
    } else {
      for(index=0; index<len; index++) {
        obj = this.get(this._ids[index]);
        if(fn.call(scope, obj) === true) {
          results.push(obj);
        }
      }
    }
    return results;
  }
}
