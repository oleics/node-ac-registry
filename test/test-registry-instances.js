
// Instances

var assert = require('assert');
var throws = require('./throws');

module.exports = testRegistryInstances;

function testRegistryInstances(ctx) {
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

  describe('#ids()', function() {
    it('returns an array of all ids');
  });

  describe('#exists(id)', function() {
    it('returns TRUE if id exists, FALSE otherwise', function() {
      reg.setType('foo', FooType);
      var obj = new FooType({ id: '123' });
      reg.add(obj);
      assert(reg.exists(obj.id) === true);
      assert(reg.exists(obj.id+'na') === false);
    });
  });

  describe('#add(props [, type])', function() {
    it('adds an object to the registry', function(){
      reg.setType('foo', FooType);
      reg.setType('bar', BarType);

      var obj = new FooType({ id: '123' });
      reg.add(obj);
      assert(reg.exists(obj.id) === true);
      assert(reg.is(obj.id, 'foo') === true);
      assert(reg.is(obj.id, 'bar') === false);
      assert(reg.get(obj.id) instanceof FooType);
      assert(!(reg.get(obj.id) instanceof BarType));

      reg.add({ type: 'foo', id: '234' });
      assert(reg.exists('234') === true);
      assert(reg.is('234', 'foo') === true);
      assert(reg.get('234') instanceof FooType);

      reg.add({ id: '345' }, 'foo');
      assert(reg.exists('345') === true);
      assert(reg.is('345', 'foo') === true);
      assert(reg.get('345') instanceof FooType);
    });

    it('returns the id of the object', function(){
      reg.setType('foo', FooType);
      assert.equal(reg.add({ id: '345' }, 'foo'), '345');
    });

    it('generates missing ids', function(){
      reg.setType('foo', FooType);
      var id = reg.add({}, 'foo');
      // console.log(reg);
      // console.log(reg.get(id));
      assert(id);
      assert.equal(reg.get(id).id, id);
    });

    it('throws if id is already taken by another object', function(){
      reg.setType('foo', FooType);
      reg.add({ id: '345' }, 'foo');
      assert(throws(function(){
        reg.add({ id: '345' }, 'foo');
      }));
    });

    describe('Variations of props', function() {
      describe('String', function() {
        it('might be a type', function(){
          reg.setType('foo', FooType);
          var id = reg.add('foo');
          assert(reg.is(id, 'foo') === true);
          assert(reg.get(id) instanceof FooType);
        });

        it('might be an id', function(){
          reg.setType('foo', FooType);
          var id = '123';
          reg.add(id, 'foo');
          assert(reg.is(id, 'foo') === true);
          assert(reg.get(id) instanceof FooType);
        });

        it('might be a require-module', function(){
          reg.setType('foo', FooType);
          var id = reg.add(__dirname+'/suite/foo-type', 'foo');
          assert(reg.is(id, 'foo') === true);
          assert(reg.get(id) instanceof FooType);
          reg.setType('bar', BarType);
          var id = reg.add(__dirname+'/suite/bar-type');
          assert(reg.is(id, 'bar') === true);
          assert(reg.get(id) instanceof BarType);
        });
      });

      describe('Function', function() {
        it('might be a registered type', function(){
          reg.setType('foo', FooType);
          var id = reg.add(FooType);
          assert(reg.is(id, 'foo') === true);
          assert(reg.get(id) instanceof FooType);
        });

        it('might return something else', function(){
          reg.setType('foo', FooType);
          var id = reg.add(function(){
            return {type: 'foo'};
          });
          assert(reg.is(id, 'foo') === true);
          assert(reg.get(id) instanceof FooType);
        });
      });

      describe('Object', function() {
        describe('props.type', function(){
          it('sets the type', function(){
            reg.setType('foo', FooType);
            var id = reg.add({
              type: 'foo'
            });
            assert(!(reg.get(id) instanceof BarType));
            assert(reg.get(id) instanceof FooType);
            assert(reg.is(id, 'foo') === true);
            reg.setType('bar', BarType);
            var id = reg.add({
              type: 'bar'
            });
            assert(reg.get(id) instanceof BarType);
            assert(reg.get(id) instanceof FooType);
            assert(reg.is(id, 'foo') === true);
            assert(reg.is(id, 'bar') === true);
          });

          it('throws if type is not existing', function() {
            assert(throws(function(){
              var id = reg.add({
                type: 'baz'
              });
            }));
          });
        });

        describe('props.ctor', function(){
          it('sets the ctor', function() {
            reg.setType('foo', FooType);
            var id = reg.add({
              ctor: FooType
            });
            assert(!(reg.get(id) instanceof BarType));
            assert(reg.get(id) instanceof FooType);
            assert(reg.is(id, 'foo') === true);
            var id = reg.add({
              ctor: BarType
            });
            assert(reg.get(id) instanceof BarType);
            assert(reg.get(id) instanceof FooType);
            assert(reg.is(id, 'foo') === true);
          });

          it('can be a require-module id/path', function() {
            reg.setType('foo', FooType);
            var id = reg.add({
              ctor: __dirname+'/suite/foo-type'
            });
            assert(!(reg.get(id) instanceof BarType));
            assert(reg.get(id) instanceof FooType);
            assert(reg.is(id, 'foo') === true);
          });

          it('throws if no type exists for ctor', function() {
            assert(throws(function(){
              var id = reg.add({
                ctor: BazType
              });
            }));
          });
        });

        describe('props.id', function(){
          it('sets the id');
        });

        describe('props.options', function(){
          it('sets the options for the object', function(){
            reg.setType('foo', FooType);
            var id = reg.add({
              options: 'bar'
            }, 'foo');
            assert(reg.is(id, 'foo') === true);
            assert(reg.get(id) instanceof FooType);
            assert(reg.get(id).options === 'bar');
          });
        });
      });
    });
  });

  describe('#get(id)', function() {
    it('returns an object');
  });

  describe('#remove(id)', function() {
    it('returns true if the object of id was removed, otherwise false');
  });
}
