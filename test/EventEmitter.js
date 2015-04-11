(function() {
  "use strict";
  var should = require("should");
  var EventEmitter = require("../dist/EventEmitter").EventEmitter;
  var sinon = require("sinon");

  describe("EventEmitter", function() {
    var eventEmitter;

    beforeEach(function() {
      eventEmitter = new EventEmitter();
    });

    describe("on", function() {

      it("should register a listener to receive events of a certain type", function() {
        eventEmitter.listeners.has("click").should.be.false;
        let listener = function() {};
        eventEmitter.on("click", listener);
        eventEmitter.listeners.has("click").should.be.true;
        let listeners = eventEmitter.listeners.get("click");
        listeners.forEach(function(fun) {
          fun.should.equal(listener);
        });
      });
    });

    describe("off", function() {

      it("should remove a listener from the EventEmitter", function() {
        let listener = function() {};
        eventEmitter.on("click", listener);
        eventEmitter.listeners.has("click").should.be.true;
        eventEmitter.off("click", listener);
        eventEmitter.listeners.get("click").size.should.equal(0);
      });

    });

    describe("trigger", function() {

      it("should call all functions subscribed for a certain event type", function() {
        let listener = function(message) {
          message.should.equal("hello world");
        };
        eventEmitter.on("helloWorlds", listener);
        eventEmitter.trigger("goodbye", "goodbye");
        eventEmitter.trigger("helloWorlds", "hello world");
      });
      
      it("should trigger functions subscribed to all on all events", function() {
        let spy = sinon.spy();
        eventEmitter.on("all", spy);
        eventEmitter.trigger("change");
        spy.callCount.should.equal(1);
      });

    });

  });
})();
