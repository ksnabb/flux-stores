(function() {
  "use strict";
  var should = require("should");
  var Collection = require("..").Collection;
  var Model = require("..").Model;
  var sinon = require("sinon");
  var _ = require("underscore");

  describe("Collection", function() {

    describe("constructor", function() {

      it("should take js objects as arguments when creating a new collection", function() {
        let col = new Collection([{
          "id": 1
        }, {
          "id": 2
        }]);
        col.length.should.equal(2);
      });

      it("should reflect model id changes to the collection keys", function() {
        let m = new Model({
          "id": "one",
          "name": "micky"
        });
        let col = new Collection();
        col.add(m);
        col.get("one").get("name").should.equal("micky");
        col.get("one").set({
          "id": "two"
        });
        col.get("two").get("name").should.equal("micky");
      });

    });

    describe("extend", function() {
      
      describe("initialize", function() {

        it("should be called when creating a new collection where the initialize function is set", function() {
          var calledInitialize = false;
          var InitializeCollection = Collection.extend({
            initialize: function(objs) {
              objs.length.should.equal(1);
              objs[0].some.should.equal("model");
              calledInitialize = true;
            }
          });
          new InitializeCollection([{
            "some": "model"
          }]);
          calledInitialize.should.be.true;
        });
      });
      
      describe("Model", function() {
        
        it("should be used as the class for the items in the collection", function() {
          var M = Model.extend({
            sayMyName: function() {
              return "my name";
            }
          });
          var C = Collection.extend({
            Model: M
          });
          var col = new C([{
            "id": 1
          }]);
          col.get(1).sayMyName().should.equal("my name");
        });
        
      });
      
    });
    
    describe("on", function() {
      
      it("should propagate change events from the contained models", function() {
        var spy = sinon.spy();
        let col = new Collection([{
          "id": 1,
          "value": 2
        }]);
        col.on("change:value", spy);
        col.get(1).set({"value": 3});
        spy.callCount.should.equal(1);
      });
      
    });

    describe("add", function() {

      it("should add js objects as models to the collection", function() {
        let collection = new Collection();
        collection.add([{
          "id": 1,
          "hello": "world"
        }, {
          "id": 2,
          "hello": "something"
        }]);
        collection.length.should.equal(2);
        collection.get(1).get("hello").should.equal("world");
        collection.get(2).get("hello").should.equal("something");
      });

      it("should add models as Model instances to the collection", function() {
        let m = new Model({
          "id": "hello",
          "name": "model"
        });
        let col = new Collection();
        col.add(m);
        col.get("hello").get("name").should.equal("model");
      });

      it("should merge if a model with the same id is already found in the collection", function() {
        let m1 = new Model({
          "id": "hello",
          "name": "model"
        });
        let m2 = new Model({
          "id": "hello",
          "age": 30
        });
        let col = new Collection();
        col.add(m1);
        col.add(m2);
        col.get("hello").get("name").should.equal("model");
        col.get("hello").get("age").should.equal(30);
        col.length.should.equal(1);
      });

      it("should trigger an add event with the added objects", function(done) {
        let collection = new Collection();
        collection.on("add", function(addedObjects) {
          addedObjects.should.be.instanceof(Array).and.have.lengthOf(2);
          done();
        });
        collection.add([{
          "id": 1
        }, {
          "id": 2
        }]);
      });

      it("should assign default id to models without id", function() {
        let col = new Collection();
        col.add([{
          "id": "one",
          "age": 12
        }, {
          "age": 14
        }, {
          "age": 30
        }, {
          "age": 35
        }]);
        col.length.should.equal(4);
      });

    });

    describe("toJSON", function() {

      it("should return js objects of all the containing models", function() {
        let collection = new Collection();
        let objs = [{
          "id": 1
        }, {
          "id": 2
        }];
        collection.add(objs);
        let jsObjs = collection.toJSON();
        _.isEqual(jsObjs, objs).should.be.true;
      });
    });

    describe("comparator", function() {
      it("should sort the returned js objects when added to a collection", function() {
        let SortedCollection = Collection.extend({
          "comparator": function(modelA, modelB) {
            return modelA.get("hello").localeCompare(modelB.get("hello"));
          }
        });
        let objs = [{
          "id": 1,
          "hello": "something"
        }, {
          "id": 2,
          "hello": "world"
        }];
        let col = new SortedCollection(objs),
          jsObjs = col.toJSON();
        jsObjs[0].hello.should.equal("something");
        jsObjs[1].hello.should.equal("world");
      });
    });

    describe("filter", function() {

      it("should return an array of models that pass the filter function (returns true)", function() {
        let col = new Collection([{
          "id": 1
        }, {
          "id": 2
        }, {
          "id": 3
        }]);
        let models = col.filter(function(m) {
          return m.get("id") < 3;
        });
        models.should.have.lengthOf(2);
        models.forEach(function(m) {
          m.get("id").should.be.below(3);
        });
      });

      it("should return a sorted result according to set comparator function", function() {
        var SortedCollection = Collection.extend({
          idAttribute: "age",
          comparator: function(a, b) {
            return b.get("age") - a.get("age");
          }
        });
        var col = new SortedCollection([{
          "age": 4,
          "name": "mike"
        }, {
          "age": 5,
          "name": "mike"
        }, {
          "age": 3,
          "name": "nomike"
        }]);
        var res = col.filter(
          function(m) {
            return m.get("name") === "mike";
          }
        );
        res[0].get("age").should.equal(5);
        res[1].get("age").should.equal(4);
      });
    });

    describe("map", function() {

      it("should return an array of models that has been modified by the passed in function", function() {
        let col = new Collection([{
          "id": 1,
          "wage": 1
        }, {
          "id": 2,
          "wage": 2
        }, {
          "id": 3,
          "wage": 3
        }]);
        var wages = [];
        var res = col.each(function(model) {
          wages.push(model.toJSON().wage);
        });
        wages.should.have.lengthOf(3);
        wages.should.containDeep([1,2,3]);
      });

    });

    describe("each", function() {

      it("should call the passed in function for each value in the collection", function() {
        let col = new Collection([{
          "id": 1,
          "wage": 1
        }, {
          "id": 2,
          "wage": 2
        }, {
          "id": 3,
          "wage": 3
        }]);
        var res = col.map(function(model) {
          return model.toJSON().wage * 10;
        });
      });

    });


    describe("where", function() {

      it("should return an array of models that contains the passed in attributes", function() {
        var col = new Collection([{
          "id": 1,
          "name": "mike"
        }, {
          "id": 2,
          "name": "judge"
        }]);
        var res = col.where({
          "name": "mike"
        });
        res.should.have.lengthOf(1);
        res[0].get("id").should.equal(1);
      });

      it("should return the results in sorted order according to a comparator", function() {
        var SortedCollection = Collection.extend({
          idAttribute: "age",
          comparator: function(a, b) {
            return b.get("age") - a.get("age");
          }
        });
        var col = new SortedCollection([{
          "age": 4,
          "name": "mike"
        }, {
          "age": 5,
          "name": "mike"
        }, {
          "age": 3,
          "name": "nomike"
        }]);
        var res = col.where({
          "name": "mike"
        });
        res[0].get("age").should.equal(5);
        res[1].get("age").should.equal(4);
      });

    });

    describe("findWhere", function() {

      it("should return the first objects found matching the attributes passed in", function() {
        var col = new Collection([{
          "id": 1,
          "name": "mike"
        }, {
          "id": 2,
          "name": "judge"
        }, {
          "id": 3,
          "name": "mike"
        }]);
        var res = col.findWhere({
          "name": "mike"
        });
        res.get("name").should.equal("mike");
        res.get("id").should.equal(1);
      });

    });

    describe("reset", function() {

      it("should reset the collection so that the collection is empty when no models are passed in", function() {
        var col = new Collection([{
          "id": 1,
          "name": "mike"
        }, {
          "id": 2,
          "name": "judge"
        }, {
          "id": 3,
          "name": "mike"
        }]);
        col.length.should.equal(3);
        col.reset();
        col.length.should.equal(0);
      });

      it("should replace the models in a collection with the passed in models", function() {
        var col = new Collection([{
          "id": 1,
          "name": "mike"
        }, {
          "id": 2,
          "name": "judge"
        }, {
          "id": 3,
          "name": "mike"
        }]);
        col.length.should.equal(3);
        col.reset([{
          "id": "hello",
          "name": "new"
        }]);
        col.length.should.equal(1);
        col.get("hello").get("name").should.equal("new");
      });

    });

  });
})();
