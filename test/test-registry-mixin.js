
// Mixin

var assert = require('assert');
var throws = require('./throws');

module.exports = testRegistryMixin;

function testRegistryMixin(ctx) {
  describe('#mixin(type, obj)', function(){
    describe('obj#add*(props [, type])', function(){
      it('mixin');
    });
    describe('obj#has*(type)', function(){
      it('mixin');
    });
    describe('obj#each*(fn [, scope])', function(){
      it('mixin');
    });
    describe('obj#filter*(fn [, scope])', function(){
      it('mixin');
    });
    describe('obj#some*(fn [, scope])', function(){
      it('mixin');
    });
    describe('obj#reduce*(fn [, initValue [, scope]])', function(){
      it('mixin');
    });
  });
}
