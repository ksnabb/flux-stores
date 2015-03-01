"use strict";
var should = require("should");
var Collection = require("../dist/Collection").Collection;
var _ = require("underscore");

describe("Collection", function() {
  // test data
  let objs = [{
    "id": 1,
    "hello": "world"
  }, {
    "id": 2,
    "hello": "something"
  }], collection;

  beforeEach(function() {
    collection = new Collection();
  });

  describe("constructor", function() {

    it("should take js objects as arguments when creating a new collection", function() {
      let col = new Collection(objs);
      col.length.should.equal(2);
    });
  });

  describe("add", function() {

    it("should add js objects as models to the collection", function() {
      collection.add(objs);
      collection.length.should.equal(2);
      collection.get(1).get("hello").should.equal("world");
      collection.get(2).get("hello").should.equal("something");
    });
  });

  describe("toJSON", function() {

    it("should return js objects of all the containing models", function() {
      collection.add(objs);
      let jsObjs = collection.toJSON();
      _.isEqual(jsObjs, objs).should.be.true;
    });
  });

});
