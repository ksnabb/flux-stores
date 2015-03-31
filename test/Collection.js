(function() {
  "use strict";
  var should = require("should");
  var Collection = require("..").Collection;
  var Model = require("..").Model;
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
      
      it("should add models as models to the collection", function() {
        let m = new Model({
          "id": "hello",
          "name": "model"
        });
        let col = new Collection();
        col.add(m);
        col.get("hello").get("name").should.equal("model");
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
        col.add([
          {"id": "one", "age": 12},
          {"age": 14},
          {"age": 30},
          {"age": 35}
        ]);
        col.length.should.equal(4);
      });

    });

    describe("toJSON", function() {

      it("should return js objects of all the containing models", function() {
        let collection = new Collection();
        let objs = [{"id": 1}, {"id": 2}];
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
        let objs = [{"id": 1, "hello": "something"}, {"id": 2, "hello": "world"}];
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
          return m.get("id") < 3
        });
        models.should.have.lengthOf(2);
        models.forEach(function(m) {
          m.get("id").should.be.below(3);
        })
      });

    });
    
    describe("map", function() {
      
      it("should return an array of models that has been modified by the passed in function", function() {
        let col = new Collection([{
          "id": 1,
          "wage": 1
        },{
          "id": 2,
          "wage": 2
        },{
          "id": 3,
          "wage": 3
        }]);
        var res = col.map(function(model) {
          return model.toJSON().wage * 10;
        })
        res.length.should.equal(3);
        res[0].should.equal(10);
      });
      
    });


    describe("where", function() {

      it("should return an array of models that contains the passed in attributes", function() {
        var col = new Collection([{
          "id": 1,
          "name": "mike"
        },
        {
          "id": 2,
          "name": "judge"
        }]);
        var res = col.where({"name": "mike"});
        res.should.have.lengthOf(1);
        res[0].get("id").should.equal(1);
      });

    });

    describe("findWhere", function() {

      it("should return the first objects found matching the attributes passed in", function() {
        var col = new Collection([{
          "id": 1,
          "name": "mike"
        },
        {
          "id": 2,
          "name": "judge"
        },
        {
          "id": 3,
          "name": "mike"
        }]);
        var res = col.findWhere({"name": "mike"})
        res.get("name").should.equal("mike");
        res.get("id").should.equal(1);
      });

    });

    describe("reset", function() {

      it("should reset the collection so that the collection is empty when no models are passed in", function() {
        var col = new Collection([{
          "id": 1,
          "name": "mike"
        },
        {
          "id": 2,
          "name": "judge"
        },
        {
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
        },
        {
          "id": 2,
          "name": "judge"
        },
        {
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
