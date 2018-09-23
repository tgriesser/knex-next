"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const datatypes_1 = require("./datatypes");
function isRawNode(obj) {
    return immutable_1.Record.isRecord(obj) && obj.get("__typename") === datatypes_1.NodeTypeEnum.RAW;
}
exports.isRawNode = isRawNode;
