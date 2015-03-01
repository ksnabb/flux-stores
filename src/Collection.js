import {EventEmitter} from "./EventEmitter";
import {Model} from "./Model";

export class Collection extends EventEmitter {
  constructor(models) {
    this.models = new Map();
    if(models !== undefined) {
      models.forEach( (mod) => this.models.set( mod[this.idAttribute], new Model(mod) ) );
    }
    this.length = this.models.size;
  }
  
  add(objs) {
    objs.forEach( (obj) => this.models.set( obj[this.idAttribute], new Model(obj) ) );
    this.length = this.models.size;
  }

  get(id) {
    return this.models.get(id);
  }
  
  _getModels() {
    let models = [];
    this.models.forEach( (mod) => models.push(mod) )
    if(this.comparator) {
      models.sort(comparator);
    }
    return models;
  }
  
  // pass in comparator to get objects in sorted order
  toJSON(comparator) {
    let models = this._getModels(),
        objs = [];
    models.forEach( (mod) => objs.push(mod.toJSON()) )
    return objs;
  }
}

Collection.prototype.idAttribute = "id";
