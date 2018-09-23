"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WhereClauseBuilder_1 = require("./clauses/WhereClauseBuilder");
const datatypes_1 = require("./data/datatypes");
const SelectBuilder_1 = require("./SelectBuilder");
class DeleteBuilder extends WhereClauseBuilder_1.WhereClauseBuilder {
    constructor(ast = datatypes_1.deleteAst) {
        super();
        this.ast = ast;
    }
    from(tableName) {
        return this.chain(ast => ast.set("table", tableName));
    }
    getAst() {
        return this.ast;
    }
    subQuery(fn) {
        const builder = new SelectBuilder_1.SelectBuilder();
        fn.call(builder, builder);
        return new datatypes_1.SubQueryNode({ ast: builder.getAst() });
    }
    toOperation() {
        return this.grammar.toOperation(this.ast);
    }
    chain(fn) {
        this.ast = fn(this.ast);
        return this;
    }
}
exports.DeleteBuilder = DeleteBuilder;
