"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WhereClauseBuilder_1 = require("./WhereClauseBuilder");
const datatypes_1 = require("./data/datatypes");
class UpdateBuilder extends WhereClauseBuilder_1.WhereClauseBuilder {
    constructor(ast = datatypes_1.updateAst) {
        super();
        this.ast = ast;
    }
    table(tableName) { }
    set(values) { }
    getAst() {
        return this.ast;
    }
    chain(fn) {
        this.ast = fn(this.ast);
        return this;
    }
}
exports.UpdateBuilder = UpdateBuilder;
