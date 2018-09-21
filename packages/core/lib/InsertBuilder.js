"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("./Grammar");
const datatypes_1 = require("./data/datatypes");
class InsertBuilder {
    constructor(ast = datatypes_1.insertAst) {
        this.ast = ast;
        this.dialect = null;
        this.grammar = new Grammar_1.Grammar();
    }
    values(toInsert) { }
    select(subQuery) { }
    inBatchesOf(value) { }
    insertInto(tableName) {
        return this.chain(ast => ast.set("table", tableName));
    }
    insertGetId() {
        return this.chain(ast => {
            return ast;
        });
    }
    getAst() {
        return this.ast;
    }
    toOperation() {
        return this.grammar.toOperation(this.ast);
    }
    chain(fn) {
        this.ast = fn(this.ast);
        return this;
    }
    log(msg) {
        console.log(msg);
    }
    error(err) {
        console.error(err);
    }
    warn(warning) {
        console.warn(warning);
    }
}
exports.InsertBuilder = InsertBuilder;
