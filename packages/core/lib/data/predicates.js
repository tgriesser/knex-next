"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const datatypes_1 = require("./datatypes");
const SelectBuilder_1 = require("../SelectBuilder");
function isRawNode(obj) {
    return immutable_1.Record.isRecord(obj) && obj.get("__typename") === datatypes_1.NodeTypeEnum.RAW;
}
exports.isRawNode = isRawNode;
function isSelectBuilder(obj) {
    return obj instanceof SelectBuilder_1.SelectBuilder;
}
exports.isSelectBuilder = isSelectBuilder;
