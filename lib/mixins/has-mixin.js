
module.exports = HasMixin;

function HasMixin() {
  var registry = this;

  this.has = has;

  function has(id, type) {
    if(id != null && id.id != null) {
      id = id.id;
    }
    var len = this._ids.length, index;
    for(index=0; index<len; index++) {
      if(this._items[index].type === type && this.isChildOf(this._ids[index], id)) {
        return true;
      }
    }
    return false;
  }
}
