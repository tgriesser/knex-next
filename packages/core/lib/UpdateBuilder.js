"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WhereClauseBuilder_1 = require("./clauses/WhereClauseBuilder");
const datatypes_1 = require("./data/datatypes");
const SelectBuilder_1 = require("./SelectBuilder");
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
    subQuery(fn) {
        const builder = new SelectBuilder_1.SelectBuilder();
        fn.call(builder, builder);
        return datatypes_1.SubQueryNode({ ast: builder.getAst() });
    }
}
exports.UpdateBuilder = UpdateBuilder;
