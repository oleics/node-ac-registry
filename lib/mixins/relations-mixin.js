
module.exports = RelationsMixin;

function RelationsMixin() {
  var _relsPC = {}; // Parent > Child
  var _relsCP = {}; // Child > Parent

  this.addChildTo = addChildTo;
  this.removeChildFrom = removeChildFrom;
  this.isChildOf = isChildOf;
  this.isParentOf = isParentOf;
  this.hasChilds = hasChilds;
  this.hasParents = hasParents;
  this.clearRelations = clearRelations;

  function addChildTo(idOrObj, pidOrObj) {
    if(idOrObj.id != null) idOrObj = idOrObj.id;
    if(!this.exists(idOrObj)) return false;
    if(pidOrObj.id != null) pidOrObj = pidOrObj.id;
    if(!this.exists(pidOrObj)) return false;
    _add(_relsPC, pidOrObj, idOrObj);
    _add(_relsCP, idOrObj, pidOrObj);
    return true;
  }

  function removeChildFrom(idOrObj, pidOrObj) {
    var index;
    if(pidOrObj.id != null) pidOrObj = pidOrObj.id;
    if(_relsPC[pidOrObj] == null) return false;
    if(idOrObj.id != null) idOrObj = idOrObj.id;
    _remove(_relsPC, pidOrObj, idOrObj);
    _remove(_relsCP, idOrObj, pidOrObj);
    return true;
  }

  function isChildOf(idOrObj, pidOrObj) {
    if(pidOrObj.id != null) pidOrObj = pidOrObj.id;
    if(_relsPC[pidOrObj] == null) return false;
    if(idOrObj.id != null) idOrObj = idOrObj.id;
    if(_relsPC[pidOrObj].indexOf(idOrObj) === -1) return false;
    return true;
  }

  function isParentOf(idOrObj, cidOrObj) {
    if(cidOrObj.id != null) cidOrObj = cidOrObj.id;
    if(_relsCP[cidOrObj] == null) return false;
    if(idOrObj.id != null) idOrObj = idOrObj.id;
    if(_relsCP[cidOrObj].indexOf(idOrObj) === -1) return false;
    return true;
  }

  function hasChilds(idOrObj) {
    if(idOrObj.id != null) idOrObj = idOrObj.id;
    if(_relsPC[pidOrObj] == null) return false;
    return _relsPC[pidOrObj].length !== 0;
  }

  function hasParents(idOrObj) {
    if(idOrObj.id != null) idOrObj = idOrObj.id;
    if(_relsCP[pidOrObj] == null) return false;
    return _relsCP[pidOrObj].length !== 0;
  }

  function clearRelations(idOrObj) {
    var arr, len, index;
    if(idOrObj.id != null) idOrObj = idOrObj.id;
    // P > C
    if(_relsPC[idOrObj] != null) {
      arr = _relsPC[idOrObj];
      len = arr.length;
      for(index=0; index<len; index++) {
        _remove(_relsCP, arr[index], idOrObj);
      }
      delete _relsPC[idOrObj];
    }
    // C > P
    if(_relsCP[idOrObj] != null) {
      arr = _relsCP[idOrObj];
      len = arr.length;
      for(index=0; index<len; index++) {
        _remove(_relsPC, arr[index], idOrObj);
      }
      delete _relsCP[idOrObj];
    }
    return true;
  }

  //

  function _add(rels, id, cid) {
    if(rels[id] == null) rels[id] = [];
    if(rels[id].indexOf(cid) !== -1) return false;
    rels[id].push(cid);
    return true;
  }

  function _remove(rels, id, cid) {
    if(rels[id] == null) return false;
    index = rels[id].indexOf(cid);
    if(index !== -1) {
      rels[id].splice(index, 1);
      if(rels[id].length === 0) {
        delete rels[id];
      }
    }
    return true;
  }
}
