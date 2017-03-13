
var Registry = require('./registry');
var _singleton = null;

Registry.singleton = registrySingleton;
module.exports = registrySingleton();

function registrySingleton() {
  if(_singleton == null) {
    _singleton = new Registry();
  }
  return _singleton;
}
