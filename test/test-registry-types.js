
// Types

var assert = require('assert');
var throws = require('./throws');

module.exports = testRegistryTypes;

function testRegistryTypes(ctx) {
  var reg, FooType, BarType, BazType;
  beforeEach(function(){
    reg = ctx.reg;
    FooType = ctx.FooType;
    BarType = ctx.BarType;
    BazType = ctx.BazType;
  });
  afterEach(function(){
    reg = null;
    FooType = null;
    BarType = null;
    BazType = null;
  });

  describe('#types()', function() {
    it('returns an array', function() {
      reg.setType('foo', FooType);
      var types = reg.types();
      assert(types instanceof Array);
      assert(types.length === 1);
      assert(types[0] === 'foo');
    });
  });

  describe('#setType(type, ctor)', function() {
    it('adds a type', function() {
      reg.setType('foo', FooType);
      assert(reg.getCtor('foo') === FooType);
    });

    it('throws if type already exists', function() {
      reg.setType('foo', FooType);
      assert(throws(function(){ reg.setType('foo', FooType); }));
    });

    it('throws if ctor is not a function', function() {
      assert(throws(function(){ reg.setType('foo', {}); }));
    });
  });

  describe('#typeExists(type)', function() {
    it('returns TRUE if type exists, FALSE otherwise', function() {
      reg.setType('foo', FooType);
      assert(reg.typeExists('foo') === true);
      assert(reg.typeExists('bar') === false);
    });
  });

  describe('#typeCtorExists(ctor)', function() {
    it('returns TRUE if ctor exists, FALSE otherwise', function() {
      reg.setType('foo', FooType);
      assert(reg.typeCtorExists(FooType) === true);
      assert(reg.typeCtorExists(BarType) === true);
      assert(reg.typeCtorExists(BazType) === false);
    });
  });

  describe('#getCtor(type)', function() {
    it('returns the ctor of a type or undefined', function() {
      reg.setType('foo', FooType);
      assert(reg.getCtor('foo') === FooType);
      assert(reg.getCtor('bar') === undefined);
    });
  });

  describe('#isA(ctor, type)', function() {
    it('returns TRUE if ctor is or inherits type');
  });

  describe('#isType(ctor)', function() {
    it('returns TRUE if ctor is a type, FALSE otherwise', function() {
      reg.setType('foo', FooType);
      assert(reg.isType(FooType) === true);
      assert(reg.isType(BarType) === false);
    });
  });

  describe('#typeOf(ctor)', function() {
    it('returns the type of an ctor', function() {
      reg.setType('foo', FooType);
      assert(reg.typeOf(FooType) === 'foo');
      assert(reg.typeOf(BarType) === 'foo');
      assert(reg.typeOf(BazType) === undefined);
    });
  });

  describe('#typesOf(obj)', function() {
    it('returns the type of an object', function() {
      reg.setType('foo', FooType);
      var foo = new FooType();
      assert(reg.typesOf(foo).indexOf('foo') !== -1);
      reg.setType('bar', BarType);
      var bar = new BarType();
      assert(reg.typesOf(bar).indexOf('foo') !== -1);
      assert(reg.typesOf(bar).indexOf('bar') !== -1);
      var baz = new BazType();
      assert(reg.typesOf(baz).length === 0);
    });
  });

  describe('#isAnyType(obj)', function() {
    it('returns TRUE ib obj is of any type, FALSE otherwise');
  });

  describe('#is(objOrId, typeOrCtor)', function() {
    it('returns TRUE if objOrId is of type, FALSE otherwise. throws if typeOrCtor is unknown', function() {
      reg.setType('foo', FooType);
      reg.setType('bar', BarType);
      var obj = new FooType();
      assert(reg.is(obj, 'foo') === true);
      assert(reg.is(obj, FooType) === true);
      assert(reg.is(obj, 'bar') === false);
      assert(reg.is(obj, BarType) === false);
      assert(throws(function(){ reg.is(obj, 'baz'); }));
      assert(throws(function(){ reg.is(obj, BazType); }));
      // as an id
      obj.type = 'foo';
      obj.id = '123';
      reg.add(obj);
      assert(reg.is(obj.id, 'foo') === true);
      assert(reg.is(obj.id, FooType) === true);
      assert(reg.is(obj.id, 'bar') === false);
      assert(reg.is(obj.id, BarType) === false);
      assert(throws(function(){ reg.is(obj.id, 'baz'); }));
      assert(throws(function(){ reg.is(obj.id, BazType); }));
    });
  });
}
