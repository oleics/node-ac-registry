
var isFunction = require('../helper').isFunction;

module.exports = ItersMixin;

function ItersMixin() {

  this.each = each;

  function each(type, pid, fn, scope) {
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

    // iter
    var len = this._ids.length, index, id;
    if(type != null && pid != null) {
      for(index=0; index<len; index++) {
        id = this._ids[index];
        if(this._items[index].type === type && this.isChildOf(id, pid)) {
          fn.call(scope, this.get(id));
        }
      }
    } else if(type != null) {
      for(index=0; index<len; index++) {
        if(this._items[index].type === type) {
          fn.call(scope, this.get(this._ids[index]));
        }
      }
    } else if(pid != null) {
      for(index=0; index<len; index++) {
        id = this._ids[index];
        if(this.isChildOf(id, pid)) {
          fn.call(scope, this.get(id));
        }
      }
    } else {
      for(index=0; index<len; index++) {
        fn.call(scope, this.get(this._ids[index]));
      }
    }
  }
}
