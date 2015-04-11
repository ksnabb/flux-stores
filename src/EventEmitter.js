export class EventEmitter {

  constructor() {
    this.listeners = new Map();
  }

  on(eventType, listener) {
    let listeners = this.listeners.get(eventType);
    if (listeners === undefined) {
      this.listeners.set(eventType, new Set([listener]));
    } else {
      listeners.add(listener);
      this.listeners.set(eventType, listeners);
    }
  }

  off(eventType, listener) {
    this.listeners.get(eventType).delete(listener);
  }

  trigger(eventType, ...args) {
    let listeners = this.listeners.get(eventType);
    if(listeners) {
      listeners.forEach( (fun) => fun.apply(this, args) );
    }
    listeners = this.listeners.get("all");
    if(listeners) {
      args.unshift(eventType);
      listeners.forEach( (fun) => fun.apply(this, args) );
    }
  }
}
