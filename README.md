[![Build Status](https://travis-ci.org/ksnabb/flux-stores.svg)](https://travis-ci.org/ksnabb/flux-stores)
[![Join the chat at https://gitter.im/ksnabb/flux-stores](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ksnabb/flux-stores?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Flux Stores

This library provides FLUX stores and is somewhat inspired by Backbone models and collections.

The library itself is written in es6 and compiled with babel which means you might have to
include babel polyfill in your code to make it work in some browsers.

### Installation

To install simply run

```sh
npm install flux-stores --save
```

Then in your node / browserifyable code do:

```js
var fluxStores = require("flux-stores");
var Model = fluxStores.Model;
var Collection = fluxStores.Collection;
```

## Events

`all`
will receive all events triggered with the following parameters
    
    (eventType, args...)


## Models

Create a Model

```js
var m = new Model()
```

You can also pass in a js object that will be set as the values for the model.

```js
var m = new Model({
  "id": "idofsomekind",
  "age": 30
});
```

`set(obj)`
set the values to the model that are passed in the obj. Each value changed will trigger a change event.

```js
var m = new Model({
  "age": 30
});
m.set({
  "age": 31
}); --> {"age": 31}
```

`get(attrKey)`
get value for attribute by passing the key.

```js
var m = new Model({
  "age": 24
});
m.get("age") --> 24
```

`extend(extensionObject)`
To extend a Model use extend.

```js
var MyModel = Model.extend({
  "initialize": function() {
    console.log("this is me");
  }
});
```
`on(eventName, fun)`
Listen to events on the model with on.

```js
var m = new Model({
  "age": 30
});
m.on("change", function(model) {
  // do something with the new values
});
```
`on(eventName:property, fun)`
You can also listen to specific properties on a model with on.

```js
var m = new Model({
  "age": 30
});
m.on("change:age", function(model) {
  // do something when age prop has changed
});
```

`clear()`
will clear the model and leave it empty.

```js
var m = new Model({
  "just": "good"
});
m.clear() --> {}
```

## Collection

Create a collection

```js
var col = new Collection()
```

You can also pass in an array of objects that will be set to the collection.

```js
var col = new Collection([{"id": 1},{"id": 2}])
```

`extend(extensionObject)`
You can extend and override the default functions and params of the collection with extend.

```js
var MyCollectoin = Collection.extend({
  Model: MyModel,
  initialize: function() {
    console.log("hey init");
  },
  justDoSomething: function() {
    console.log("something");
  }
});
```

`add(objs) `
add function adds the passed in js objects to the collection. If a
model in the collection already contains another model with the same id they
will be merged.

```js
col.add([{"hello": "me", "id": 1}, {"hello": "you", "id": 2}, {"hello": "me again", "id": 1}]);
col.length --> 2
```

`add(obj)`
Also single js objects can be added.

```js
col.add({"hello": "I am single", "id": 123});
```

`add(model)`
fluxStore models can also be added.

```js
let m = new Model({"hello": "I am model", "id": 1});
col.add(m);
```

`filter(filterFunction)`
Filter will return an array of models for which the filterFunction returns true.

```js
var col = new Collection([{"age": 29},{"age": 30},{"age": 31}])
col.filter( (mod) => {
  if(mod.get("age") < 30) {
    return true;
  }
  return false;
}) --> [{"age": 29}]
```

`map(mapFunction)`
Map will return an array of models that has been passed through the mapFunction.

```js
var col = new Collection([{"age": 29},{"age": 31}]);
col.map(function(model) {
  return model.toJSON().age + 1;
}) --> [{"age": 31},{"age": 32}]
```

`each(fun)`
Will apply the function 'fun' on all containing models.

```js
var col = new Collection([{"age": 29},{"age": 31}]);
col.each(function(model) {
  model.set({"age": 1})
}) --> [{"age": 1},{"age": 1}]
```

`where(attributes)`
Where will return the models that has equal attributes to the passed in attributes.

```js
var col = new Collection([{"age": 29},{"age": 31}]);
col.where({
  "age": 31
}) --> [{"age": 31}]
```

`findWhere(attributes)`
The same as where but returns the first model matched

```js
var col = new Collection([{"age": 31, "id": 1},{"age": 31, "id": 2}]);
col.where({
  "age": 31
}) --> [{"age": 31, "id": 1}]
```

`reset(models)`
reset will replace all models in a collection with the passed in models. If no models are passed in it will just empty the collection.

```js
var col = new Collection([{"age": 31, "id": 1},{"age": 31, "id": 2}]);
col.reset([{
  "age": 31
}]) --> [{"age": 31}]
```
