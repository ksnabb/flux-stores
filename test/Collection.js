"use strict";
var should = require("should");
var Collection = require("../dist/Collection").Collection;
var _ = require("underscore");

function createCollection(funName, fun) {
  function NewCollection(objs) {
    Collection.call(this, objs);
  };
  NewCollection.prototype = Object.create(Collection.prototype);
  NewCollection.prototype[funName] = fun;
  NewCollection.prototype.constructor = NewCollection;
  return NewCollection;
}

describe("Collection", function() {
  // test data
  let objs = [{
      "id": 1,
      "hello": "world"
    }, {
      "id": 2,
      "hello": "something"
    }],
    collection;

  beforeEach(function() {
    collection = new Collection();
  });

  describe("constructor", function() {

    it("should take js objects as arguments when creating a new collection", function() {
      let col = new Collection(objs);
      col.length.should.equal(2);
    });
  });

  describe("initialize", function() {

    it("should be called when creating a new collection where the initialize function is set", function() {
      let calledInitialize = false,
        InitializeCollection = createCollection("initialize", function(objs) {
          objs.length.should.equal(1);
          objs[0].some.should.equal("model");
          calledInitialize = true;
        });
      new InitializeCollection([{
        "some": "model"
      }]);
      calledInitialize.should.be.true;
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

  describe("comparator", function() {
    let SortedCollection = createCollection("comparator", function(modelA, modelB) {
      return modelA.get("hello").localeCompare(modelB.get("hello"));
    });
    it("should sort the returned js objects when added to a collection", function() {
      let col = new SortedCollection(objs),
        jsObjs = col.toJSON();
      jsObjs[0].hello.should.equal("something");
      jsObjs[1].hello.should.equal("world");
    });
  });
});
