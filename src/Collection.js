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
}

Collection.prototype.idAttribute = "id";
