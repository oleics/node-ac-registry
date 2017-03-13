
// Destructors

var assert = require('assert');

module.exports = testRegistryDestructors;

function testRegistryDestructors(ctx) {
  describe('#destroy()', function() {
    it('destroys the registry', function() {
      ctx.reg.destroy();
      assert(ctx.reg.Registry == null);
    });
  });
}
