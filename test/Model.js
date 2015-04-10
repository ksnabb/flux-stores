(function() {
  "use strict";
  var should = require("should");
  var Model = require("..").Model;
  var sinon = require("sinon");

  describe("Model", function() {

    it("should enable creating a new model from a given js object", function() {
      var m = new Model({
        "hello": "world",
        "two": 2
      });
      m.get("hello").should.equal("world");
      m.get("two").should.equal(2);
    });

    it("should have an extend function to help creating subclasses of the Model", function() {
      var Child = Model.extend({
        "hello": function() {
          return "world";
        }
      });
      var child = new Child();
      child.hello().should.equal("world");
    });

    it("should add default values to the model when created", function() {
      var DefaultModel = Model.extend({
        defaults: {
          "hello": "world"
        }
      });
      var dm = new DefaultModel();
      dm.get("hello").should.equal("world");
    });

    it("should trigger a change event after a property has changed", function() {
      var m = new Model({
        "value": 1,
        "value2": "1"
      });
      var spy = sinon.spy();
      m.on("change", spy);
      m.set({
        "value": 2
      });
      m.set({
        "value2": 1
      });
      spy.callCount.should.equal(2);
    });

    it("should not trigger a chaange event if the value was not changed", function() {
      var m = new Model({
        "value": 2
      });
      var spy = sinon.spy();
      m.on("change", spy);
      m.set({
        "value": 2
      });
      spy.callCount.should.equal(0);
    });

    it("should trigger a change:<property name> event after the property has changed", function() {
      var m = new Model({
        "value": 1,
        "value2": "1"
      });
      var valueSpy = sinon.spy();
      m.on("change:value", valueSpy);
      var value2Spy = sinon.spy();
      m.on("change:value2", value2Spy);
      m.set({
        "value": 2
      });
      m.set({
        "value2": 1
      });
      valueSpy.callCount.should.equal(1);
      value2Spy.callCount.should.equal(1);
    });

    describe("clear", function() {

      it("should clear all values from the model", function() {
        var m = new Model({
          "age": "very young"
        });
        m.clear();
        m.toJSON().should.be.empty;
      });
    });

  });
})();
