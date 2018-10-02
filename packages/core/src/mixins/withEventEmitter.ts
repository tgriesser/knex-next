import { EventEmitter } from "events";

export function withEventEmitter(ClassToDecorate: any) {
  Object.keys(EventEmitter.prototype).forEach(key => {
    // @ts-ignore
    ClassToDecorate.prototype[key] = EventEmitter.prototype[key];
  });
}
