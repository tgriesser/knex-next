"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatypes_1 = require("./data/datatypes");
const immutable_1 = require("immutable");
function raw(query, ...bindings) {
    return datatypes_1.RawNode({
        fragments: immutable_1.List(query),
        bindings: immutable_1.List(bindings),
    });
}
exports.raw = raw;
function ident() { }
exports.ident = ident;
