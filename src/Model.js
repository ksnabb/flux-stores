import {EventEmitter} from "./EventEmitter";

export class Model extends EventEmitter {
  constructor(obj = {}) {
    this.arguments = new Map();
    this.set(obj);
  }

  set(values) {
    for(let key in values) {
      if(values.hasOwnProperty(key)) {
        this.arguments.set(key, values[key]);
      }
    }
  }
  
  get(key) {
    return this.arguments.get(key);
  }
  
}
