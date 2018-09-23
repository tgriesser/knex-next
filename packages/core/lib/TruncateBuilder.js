"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("./Grammar");
const datatypes_1 = require("./data/datatypes");
class TruncateBuilder {
    constructor(ast = datatypes_1.truncateAst) {
        this.ast = ast;
        this.grammar = new Grammar_1.Grammar();
    }
    table(tableName) {
        return this.chain(ast => ast.set("table", tableName));
    }
    getAst() {
        return this.ast;
    }
    chain(fn) {
        this.ast = fn(this.ast);
        return this;
    }
}
exports.TruncateBuilder = TruncateBuilder;
