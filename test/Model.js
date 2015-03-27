(function() {
  "use strict";
  var should = require("should");
  var Model = require("..").Model;

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
        "hello": function() {return "world"}
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

  });
})();
