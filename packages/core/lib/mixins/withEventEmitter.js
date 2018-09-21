"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
function withEventEmitter(ClassToDecorate) {
    Object.keys(events_1.EventEmitter.prototype).forEach(key => {
        Object.defineProperty(ClassToDecorate.prototype, key, {
            configurable: true,
            value() {
                if (!this.connection) {
                    this.warn(new Error(`Cannot call EventEmitter property ${key} on class ${this.constructor.name} before a connection is provided. This call will be ignored.`));
                    return this;
                }
            },
        });
    });
}
exports.withEventEmitter = withEventEmitter;
