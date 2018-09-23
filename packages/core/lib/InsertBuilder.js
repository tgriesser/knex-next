"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("./Grammar");
const datatypes_1 = require("./data/datatypes");
const SelectBuilder_1 = require("./SelectBuilder");
class InsertBuilder {
    constructor(ast = datatypes_1.insertAst) {
        this.ast = ast;
        this.dialect = null;
        this.grammar = new Grammar_1.Grammar();
    }
    into(tableName) {
        return this.chain(ast => ast.set("table", tableName));
    }
    columns(...columnName) { }
    values(toInsert) {
        return this.chain(ast => ast.set("values", ast.values.concat(toInsert)));
    }
    select(arg) {
        if (typeof arg === "function") {
            return this.chain(ast => ast.set("select", this.subQuery(arg)));
        }
        return this;
    }
    inBatchesOf(value) {
        return this.chain(ast => ast.set("chunkSize", value));
    }
    getAst() {
        return this.ast;
    }
    toOperation() {
        return this.grammar.toOperation(this.ast);
    }
    subQuery(arg) {
        const builder = new SelectBuilder_1.SelectBuilder();
        arg.call(builder, builder);
        return builder.getAst();
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
