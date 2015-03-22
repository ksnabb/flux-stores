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

  });
})();
