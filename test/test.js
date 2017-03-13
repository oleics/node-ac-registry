
var assert = require('assert');
var throws = require('./throws');
var registry = require('..');

////////////////////////////////////////////////////////////////////////////////

function createRegistry() {
  return new registry.Registry();
}

function destroyRegistry(reg) {
  reg.destroy();
}

var FooType = require('./suite/foo-type');
var BarType = require('./suite/bar-type');

function BazType(props, options) {
  if(!(this instanceof BazType)) return new BazType(props, options);
  if(props == null) props = {};
  this.type = 'baz';
  this.id = props.id;
}

////////////////////////////////////////////////////////////////////////////////

describe('ac-registry', function() {

  it('is a singleton by-default', function(){
    assert(registry instanceof registry.Registry);
  });

  it('is an instance of ac-registry.Registry', function(){
    assert(registry instanceof registry.Registry);
  });

  describe('ac-registry.Registry', function() {
    it('can be used to create new registry-objects', function(){
      var reg = new registry.Registry();
      assert(reg instanceof registry.Registry);
      assert(reg !== registry);
      reg = null;
    });
  });

  describe('ac-registry.Registry.singleton()', function() {
    it('always returns the ac-registry-singleton', function(){
      assert(registry === registry.Registry.singleton());
    });
  });

  describe('Methods', function() {
    var ctx = {};
    beforeEach(function(){
      ctx.reg = createRegistry();
      ctx.FooType = FooType;
      ctx.BarType = BarType;
      ctx.BazType = BazType;
    });
    afterEach(function(){
      destroyRegistry(ctx.reg);
      ctx.reg = null;
      ctx.FooType = null;
      ctx.BarType = null;
      ctx.BazType = null;
    });

    runTest(ctx, 'Destructors', './test-registry-destructors');
    runTest(ctx, 'Types', './test-registry-types');
    runTest(ctx, 'Instances', './test-registry-instances');
    runTest(ctx, 'Mixin', './test-registry-mixin');
    runTest(ctx, 'Relations', './test-registry-relations');
    runTest(ctx, 'Iters', './test-registry-iters');

    function runTest(ctx, label, p) {
      describe(label ? label+' ['+p+']' : '['+p+']', function(){
        require(p)(ctx);
      });
    }
  });

});
