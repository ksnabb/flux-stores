import {EventEmitter} from "./EventEmitter";
import {Model} from "./Model";

export class Collection extends EventEmitter {
  
  constructor(models) {
    this.models = new Map();
    if(models !== undefined) {
      models.forEach( (mod) => this.models.set( mod[this.idAttribute], new Model(mod) ) );
    }
    this.length = this.models.size;
    if(this.initialize) {
      this.initialize.call(this, models);
    }
    super();
  }
  
  add(objs) {
    let addedModels = [];
    objs.forEach( (obj) => {
      let oldModel = this.models.get( obj[this.idAttribute] );
      if( oldModel ) {
        oldModel.set(obj);
      } else {
        let newModel = new Model(obj); 
        this.models.set( obj[this.idAttribute], newModel );
        addedModels.push(newModel)
      }
    });
    this.length = this.models.size;
    if(addedModels.length > 0) this.trigger("add", addedModels);
  }

  get(id) {
    return this.models.get(id);
  }
  
  _getModels() {
    let models = [];
    this.models.forEach( (mod) => models.push(mod) )
    if(this.comparator) {
      models.sort(this.comparator);
    }
    return models;
  }
  
  // pass in comparator to get objects in sorted order
  toJSON() {
    let models = this._getModels(),
        objs = [];
    models.forEach( (mod) => objs.push(mod) )
    return objs.map( (mod) => mod.toJSON() );
  }
}

Collection.prototype.idAttribute = "id";
