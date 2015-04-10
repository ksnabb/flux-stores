import {
  EventEmitter
}
from "./EventEmitter";

export class Model extends EventEmitter {
  
  constructor(obj = {}) {
    this.arguments = new Map();

    if (typeof this.defaults === "object") {
      this.set(this.defaults, {
        "silent": true
      });
    } else if (typeof this.defaults === "function") {
      this.set(this.defaults(), {
        "silent": true
      });
    }

    this.set(obj, {
      "silent": true
    });
    
    this._type = "Model";
    super();
  }

  static extend(obj) {
    class Child extends this {}
    for (var funName in obj) {
      Child.prototype[funName] = obj[funName];
    }
    return Child
  }

  set(values, options = {
    "silent": false
  }) {
    let hasChanged = false;
    let oldValues = {};
    for (let key in values) {
      let newValue = values[key],
        oldValue = this.arguments.get(key);
      if (newValue !== oldValue && values.hasOwnProperty(key)) {
        oldValues[key] = newValue;
        this.arguments.set(key, newValue);
        if (!options.silent) {
          this.trigger(`change:${key}`, this, oldValue);
        }
        hasChanged = true;
      }
    }
    if (!options.silent && hasChanged) {
      this.trigger("change", this, oldValues);
    }
  }

  get(key) {
    return this.arguments.get(key);
  }
  
  clear() {
    this.arguments.clear();
  }

  toJSON() {
    let obj = {};
    for (let [key, value] of this.arguments) {
      obj[key] = value;
    }
    return obj;
  }
}
