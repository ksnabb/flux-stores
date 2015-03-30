[![Build Status](https://travis-ci.org/ksnabb/flux-stores.svg)](https://travis-ci.org/ksnabb/flux-stores)
[![Join the chat at https://gitter.im/ksnabb/flux-stores](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ksnabb/flux-stores?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Flux Stores

This library provides FLUX stores.

This package is somewhat inspired by Backbone models and collections.

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

To extend a Model use extend.

```js
var MyModel = Model.extend({
  "initialize": function() {
    console.log("this is me");
  }
});
```

To listen to changes to the model values use on.

```js
var m = new Model({
  "age": 30
});
m.on("change", function(model) {
  // do something with the new values
});
```

You can also listen to specific properties on a model with on.

```js
var m = new Model({
  "age": 30
});
m.on("change:age", function(model) {
  // do something when age prop has changed
});
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
