"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
function withEventEmitter(ClassToDecorate) {
    Object.keys(events_1.EventEmitter.prototype).forEach(key => {
        // @ts-ignore
        ClassToDecorate.prototype[key] = events_1.EventEmitter.prototype[key];
    });
}
exports.withEventEmitter = withEventEmitter;
