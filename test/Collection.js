"use strict";
var should = require("should");
var Collection = require("../dist/Collection").Collection;

describe("Collection", function() {
  
  describe("constructor", function() {
    
    it("should take js objects as arguments when creating a new collection", function() {
      let col = new Collection([{
        "id": 1,
        "hello": "world"
      }, {
        "id": 2,
        "hello": "something else"
      }]);
      col.length.should.equal(2);
    });
  });

  describe("add", function() {
    let collection;
    
    beforeEach(function() {
      collection = new Collection();
    });

    it("should add js objects as models to the collection", function() {
      let objs = [{
        "id": 1,
        "hello": "world"
      }, {
        "id": 2,
        "hello": "something"
      }];
      collection.add(objs);
      collection.length.should.equal(2);
      collection.get(1).get("hello").should.equal("world");
      collection.get(2).get("hello").should.equal("something");
    });
  });

});
