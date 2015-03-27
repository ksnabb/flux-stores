import {EventEmitter} from "./EventEmitter";

export class Model extends EventEmitter {
  constructor(obj = {}) {
    this.arguments = new Map();
    
    if(typeof this.defaults === "object") {
      this.set(this.defaults);
    } else if (typeof this.defaults === "function") {
      this.set(this.defaults());
    }
    
    this.set(obj);
  }
  
  static extend(obj) {
    class Child extends this {}
    for(var funName in obj) {
      Child.prototype[funName] = obj[funName];
    }
    return Child
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
  
  toJSON() {
    let obj = {};
    for (let [key, value] of this.arguments) {
      obj[key] = value;
    }
    return obj;
  }
}
