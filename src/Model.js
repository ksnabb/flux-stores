import {
  EventEmitter
}
from "./EventEmitter";

var uniqueId = 0;

export class Model extends EventEmitter {

  constructor(obj = {}) {
    super();
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

    if (this.initialize) this.initialize();
    if (this.idAttribute === undefined) this.idAttribute = "id";
    this.id = this.arguments.get(this.idAttribute);
    if (this.arguments.get(this.idAttribute) === undefined) {
      this.id = "c" + uniqueId;
      uniqueId++;
    }

    this._type = "Model";
  }

  static extend(obj) {
    class Child extends this {}
    for (var funName in obj) {
      Child.prototype[funName] = obj[funName];
    }
    return Child;
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
        if (key === this.idAttribute) {
          this.id = newValue;
        }
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
    let oldEntries = this.arguments.entries(),
      oldValues = [],
      hasChanged = false,
      triggers = [];
    for (let value of oldEntries) {
      triggers.push(["change:" + value[0], this, value[1]]);
      oldValues.push(value[1]);
      hasChanged = true;
    }
    if (hasChanged) {
      triggers.push(["change", this, oldValues]);
    }
    this.arguments.clear();
    triggers.forEach((triggerArgs) => this.trigger.apply(this, triggerArgs));
  }

  toJSON() {
    let obj = {};
    for (let [key, value] of this.arguments) {
      obj[key] = value;
    }
    return obj;
  }
}
