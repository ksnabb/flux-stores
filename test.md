# TOC
   - [Collection](#collection)
     - [constructor](#collection-constructor)
     - [extend](#collection-extend)
       - [initialize](#collection-extend-initialize)
       - [Model](#collection-extend-model)
     - [on](#collection-on)
     - [add](#collection-add)
     - [toJSON](#collection-tojson)
     - [comparator](#collection-comparator)
     - [filter](#collection-filter)
     - [map](#collection-map)
     - [each](#collection-each)
     - [where](#collection-where)
     - [findWhere](#collection-findwhere)
     - [reset](#collection-reset)
   - [EventEmitter](#eventemitter)
     - [on](#eventemitter-on)
     - [off](#eventemitter-off)
     - [trigger](#eventemitter-trigger)
   - [Model](#model)
     - [on](#model-on)
     - [id and idAttribute](#model-id-and-idattribute)
     - [initialize](#model-initialize)
     - [clear](#model-clear)
<a name=""></a>
 
<a name="collection"></a>
# Collection
<a name="collection-constructor"></a>
## constructor
should take js objects as arguments when creating a new collection.

```js
let col = new Collection([{
  "id": 1
}, {
  "id": 2
}]);
col.length.should.equal(2);
```

should reflect model id changes to the collection keys.

```js
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
```

<a name="collection-extend"></a>
## extend
<a name="collection-extend-initialize"></a>
### initialize
should be called when creating a new collection where the initialize function is set.

```js
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
```

<a name="collection-extend-model"></a>
### Model
should be used as the class for the items in the collection.

```js
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
```

<a name="collection-on"></a>
## on
should propagate change events from the contained models.

```js
var spy = sinon.spy();
let col = new Collection([{
  "id": 1,
  "value": 2
}]);
col.on("change:value", spy);
col.get(1).set({"value": 3});
spy.callCount.should.equal(1);
```

<a name="collection-add"></a>
## add
should add js objects as models to the collection.

```js
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
```

should add models as Model instances to the collection.

```js
let m = new Model({
  "id": "hello",
  "name": "model"
});
let col = new Collection();
col.add(m);
col.get("hello").get("name").should.equal("model");
```

should merge if a model with the same id is already found in the collection.

```js
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
```

should trigger an add event with the added objects.

```js
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
```

should assign default id to models without id.

```js
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
```

<a name="collection-tojson"></a>
## toJSON
should return js objects of all the containing models.

```js
let collection = new Collection();
let objs = [{
  "id": 1
}, {
  "id": 2
}];
collection.add(objs);
let jsObjs = collection.toJSON();
_.isEqual(jsObjs, objs).should.be.true;
```

<a name="collection-comparator"></a>
## comparator
should sort the returned js objects when added to a collection.

```js
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
```

<a name="collection-filter"></a>
## filter
should return an array of models that pass the filter function (returns true).

```js
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
```

should return a sorted result according to set comparator function.

```js
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
```

<a name="collection-map"></a>
## map
should return an array of models that has been modified by the passed in function.

```js
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
```

<a name="collection-each"></a>
## each
should call the passed in function for each value in the collection.

```js
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
```

<a name="collection-where"></a>
## where
should return an array of models that contains the passed in attributes.

```js
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
```

should return the results in sorted order according to a comparator.

```js
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
```

<a name="collection-findwhere"></a>
## findWhere
should return the first objects found matching the attributes passed in.

```js
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
```

<a name="collection-reset"></a>
## reset
should reset the collection so that the collection is empty when no models are passed in.

```js
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
```

should replace the models in a collection with the passed in models.

```js
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
```

<a name="eventemitter"></a>
# EventEmitter
<a name="eventemitter-on"></a>
## on
should register a listener to receive events of a certain type.

```js
eventEmitter.listeners.has("click").should.be.false;
let listener = function() {};
eventEmitter.on("click", listener);
eventEmitter.listeners.has("click").should.be.true;
let listeners = eventEmitter.listeners.get("click");
listeners.forEach(function(fun) {
  fun.should.equal(listener);
});
```

<a name="eventemitter-off"></a>
## off
should remove a listener from the EventEmitter.

```js
let listener = function() {};
eventEmitter.on("click", listener);
eventEmitter.listeners.has("click").should.be.true;
eventEmitter.off("click", listener);
eventEmitter.listeners.get("click").size.should.equal(0);
```

<a name="eventemitter-trigger"></a>
## trigger
should call all functions subscribed for a certain event type.

```js
let listener = function(message) {
  message.should.equal("hello world");
};
eventEmitter.on("helloWorlds", listener);
eventEmitter.trigger("goodbye", "goodbye");
eventEmitter.trigger("helloWorlds", "hello world");
```

should trigger functions subscribed to all on all events.

```js
let spy = sinon.spy();
eventEmitter.on("all", spy);
eventEmitter.trigger("change");
spy.callCount.should.equal(1);
```

<a name="model"></a>
# Model
should enable creating a new model from a given js object.

```js
var m = new Model({
  "hello": "world",
  "two": 2
});
m.get("hello").should.equal("world");
m.get("two").should.equal(2);
```

should have an extend function to help creating subclasses of the Model.

```js
var Child = Model.extend({
  "hello": function() {
    return "world";
  }
});
var child = new Child();
child.hello().should.equal("world");
```

should add default values to the model when created.

```js
var DefaultModel = Model.extend({
  defaults: {
    "hello": "world"
  }
});
var dm = new DefaultModel();
dm.get("hello").should.equal("world");
```

<a name="model-on"></a>
## on
should trigger a change event after a property has changed.

```js
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
```

should not trigger a change event if the value was not changed.

```js
var m = new Model({
  "value": 2
});
var spy = sinon.spy();
m.on("change", spy);
m.set({
  "value": 2
});
spy.callCount.should.equal(0);
```

should trigger a change:<property name> event after the property has changed.

```js
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
```

<a name="model-id-and-idattribute"></a>
## id and idAttribute
should set the id of the model.

```js
var m = new Model({
  "id": "hello"
});
m.id.should.equal("hello");
```

should set id of the model to the given idAttribute.

```js
var M = Model.extend({
  "idAttribute": "unique"
});
var m = new M({
  "unique": "hello"
});
m.id.should.equal("hello");
```

should assign a unique number as id if no id can be found.

```js
function ()  {
        var m = new Model();
        m.id.should.containEql('c');
```

<a name="model-initialize"></a>
## initialize
should be called on model creation if it exists.

```js
var spy = sinon.spy();
var M = Model.extend({
  "initialize": spy
});
var m = new M();
spy.callCount.should.equal(1);
```

<a name="model-clear"></a>
## clear
should clear all values from the model.

```js
var m = new Model({
  "age": "very young"
});
m.clear();
m.toJSON().should.be.empty;
```

should trigger a change event when clear is called.

```js
var m = new Model({
  "age": "no age"
});
var changeSpy = sinon.spy();
var changeAttrSpy = sinon.spy();
m.on("change", changeSpy);
m.on("change:age", changeAttrSpy);
m.clear();
changeSpy.callCount.should.equal(1);
changeAttrSpy.callCount.should.equal(1);
```

