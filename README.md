[![Build Status](https://travis-ci.org/ksnabb/flux-stores.svg)](https://travis-ci.org/ksnabb/flux-stores)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ksnabb/flux-stores?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
# Flux Stores

This library provides FLUX stores.

This package is somewhat inspired by Backbone models and collections.

## Models

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
