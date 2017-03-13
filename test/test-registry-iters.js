
// Iters

var assert = require('assert');
var throws = require('./throws');

module.exports = testRegistryIters;

function testRegistryIters(ctx) {
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

  describe('#has(idOrObj, type)', function(){
    it('has');
  });

  describe('#each([typeOrCtor, [pidOrObj, ]] fn, scope)', function(){
    it('each', function(){
      reg.setType('foo', FooType);
      reg.setType('bar', BarType);

      var scope = {};

      var ids = [];
      ids.push(reg.add({}, 'foo'));
      ids.push(reg.add({}, 'foo'));
      ids.push(reg.add({}, 'bar'));
      reg.addChildTo(ids[1], ids[0]);
      reg.addChildTo(ids[2], ids[0]);

      var called = 0;
      reg.each(function(obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
      }, scope);
      assert.equal(3, called);

      var called = 0;
      reg.each('foo', function(obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
      }, scope);
      assert.equal(2, called);

      var called = 0;
      reg.each('foo', ids[0], function(obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        assert(obj.id !== ids[0]);
        called++;
      }, scope);
      assert.equal(1, called);

      var called = 0;
      reg.each(BarType, ids[0], function(obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        assert(obj.id !== ids[0]);
        called++;
      }, scope);
      assert.equal(1, called);

      var called = 0;
      reg.each(null, reg.get(ids[0]), function(obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        assert(obj.id !== ids[0]);
        called++;
      }, scope);
      assert.equal(2, called);
    });
  });

  describe('#filter([typeOrCtor, [pidOrObj, ]] fn, scope)', function(){
    it('filter', function(){
      reg.setType('foo', FooType);
      reg.setType('bar', BarType);

      var scope = {};

      var ids = [];
      ids.push(reg.add({}, 'foo'));
      ids.push(reg.add({}, 'foo'));
      ids.push(reg.add({}, 'bar'));
      reg.addChildTo(ids[1], ids[0]);
      reg.addChildTo(ids[2], ids[0]);

      var called = 0;
      var results = reg.filter(function(obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
        return obj.type === 'bar';
      }, scope);
      assert.equal(3, called);
      assert.equal(1, results.length);

      var called = 0;
      var results = reg.filter('foo', function(obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
        return obj.id === ids[0];
      }, scope);
      assert.equal(2, called);
      assert.equal(1, results.length);

      var called = 0;
      var results = reg.filter(FooType, ids[0], function(obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
        return obj.type === 'bar';
      }, scope);
      assert.equal(1, called);
      assert.equal(0, results.length);

      var called = 0;
      var results = reg.filter(null, ids[0], function(obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
        return obj.type === 'bar';
      }, scope);
      assert.equal(2, called);
      assert.equal(1, results.length);
    });
  });

  describe('#some([typeOrCtor, [pidOrObj, ]] fn, scope)', function(){
    it('some');
  });

  describe('#reduce([typeOrCtor, [pidOrObj, ]] fn, initValue, scope)', function(){
    it('reduce', function(){
      reg.setType('foo', FooType);
      reg.setType('bar', BarType);

      var scope = {};

      var ids = [];
      ids.push(reg.add({}, 'foo'));
      ids.push(reg.add({}, 'foo'));
      ids.push(reg.add({}, 'bar'));
      reg.addChildTo(ids[1], ids[0]);
      reg.addChildTo(ids[2], ids[0]);

      var called = 0;
      var results = reg.reduce(function(value, obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
        value.push(obj.id);
        return value;
      }, [], scope);
      assert.equal(3, called);
      assert.equal(called, results.length);

      var called = 0;
      var results = reg.reduce('foo', function(value, obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
        value.push(obj.id);
        return value;
      }, [], scope);
      assert.equal(2, called);
      assert.equal(called, results.length);

      var called = 0;
      var results = reg.reduce(FooType, ids[0], function(value, obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
        value.push(obj.id);
        return value;
      }, [], scope);
      assert.equal(1, called);
      assert.equal(called, results.length);

      var called = 0;
      var results = reg.reduce(null, ids[0], function(value, obj){
        assert(this === scope);
        assert(ids.indexOf(obj.id) !== -1);
        called++;
        value.push(obj.id);
        return value;
      }, [], scope);
      assert.equal(2, called);
      assert.equal(called, results.length);

    });
  });
}
