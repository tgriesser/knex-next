"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unpackColumn(column) {
    if (typeof column === "string") {
        return column;
    }
    // return ColumnNode();
}
exports.unpackColumn = unpackColumn;
function unpackValue(value) {
    if (typeof value === "number") {
        return value;
    }
    return "";
}
exports.unpackValue = unpackValue;
function unpackJoin() { }
exports.unpackJoin = unpackJoin;
