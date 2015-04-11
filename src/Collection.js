import {
  EventEmitter
}
from "./EventEmitter";
import {
  Model
}
from "./Model";

export class Collection extends EventEmitter {

  constructor(models) {
    if(this.Model === undefined) this.Model = Model;
    
    this.models = new Map();
    if (models !== undefined) {
      models.forEach((mod) => {
        let newModel = new this.Model(mod);
        this.models.set(newModel.id, newModel);
      });
    }
    this.length = this.models.size;
    if (this.initialize) {
      this.initialize.call(this, models);
    }
    this._nextId = 1;
    this._type = "Collection";
    super();
  }

  static extend(obj) {
    class Child extends this {}
    for (var funName in obj) {
      Child.prototype[funName] = obj[funName];
    }
    return Child;
  }

  _add(model) {
    let oldModel = this.models.get(model.id);
    if(oldModel) {
      oldModel.set(model.toJSON());
      return false;
    } else {
      this.models.set(model.id, model);

      // listen to id changes in model to sync it with collection id
      model.on("change:" + model.idAttribute, (m, oldValue) => {
        this.models.delete(oldValue);
        this.models.set(m.id, m);
      });
      return true;
    }
  }

  add(objs) {
    let addedModels = [];
    if(objs.constructor === Array) {
      objs.forEach((obj) => {
        let newModel = new this.Model(obj);
        if(this._add(newModel)) addedModels.push(newModel);
      });
    } else if (objs._type === "Model") {
      if(this._add(objs)) addedModels.push(objs);
    } else {
      let newModel = new this.Model(objs);
      if(this._add(newModel)) addedModels.push(newModel);
    }
    this.length = this.models.size;
    if (addedModels.length > 0) this.trigger("add", addedModels);
  }

  filter(fun) {
    let filteredModels = [];
    this.models.forEach((model) => {
      if (fun(model)) {
        filteredModels.push(model);
      }
    });
    if(this.comparator) {
      filteredModels.sort(this.comparator);
    }
    return filteredModels;
  }

  map(fun) {
    let mappedValues = [];
    let iter = this.models.values();
    let next = iter.next();
    while (!next.done) {
      mappedValues.push(fun(next.value));
      next = iter.next();
    }
    return mappedValues;
  }

  each(fun) {
    let iter = this.models.values();
    let next = iter.next();
    while (!next.done) {
      fun(next.value);
      next = iter.next();
    }
  }

  where(attributes) {
    let results = [];
    for(let key in attributes) {
      if(key === this.Model.idAttribute) {
        results.push(this.models.get(attributes[key]));
        return results;
      } else if (results.length === 0) {
        for(let [modelId, model] of this.models) {
          if(model.get(key) === attributes[key]) {
            results.push(model);
          }
        }
      } else {
        let tempResults = [];
        results.forEach( (model) => {
          if(model.get(key) === attributes[key]) {
            tempResults.push(model);
          }
        });
        results = tempResults;
      }
    }
    if(this.comparator) {
      results.sort(this.comparator);
    }
    return results;
  }

  findWhere(attributes) {
    return this.where(attributes)[0];
  }

  reset(models) {
    this.models.clear();
    this.length = 0;
    if(models) {
      this.add(models);
    }
  }

  get(id) {
    return this.models.get(id);
  }

  _getModels() {
    let models = [];
    this.models.forEach((mod) => models.push(mod));
    if (this.comparator) {
      models.sort(this.comparator);
    }
    return models;
  }

  // pass in comparator to get objects in sorted order
  toJSON() {
    let models = this._getModels(),
      objs = [];
    models.forEach((mod) => objs.push(mod));
    return objs.map((mod) => mod.toJSON());
  }
}
