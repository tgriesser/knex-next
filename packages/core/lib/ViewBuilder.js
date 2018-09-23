"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("./Grammar");
const datatypes_1 = require("./data/datatypes");
const SelectBuilder_1 = require("./SelectBuilder");
class ViewBuilder {
    constructor() {
        this.grammar = new Grammar_1.Grammar();
    }
    subQuery(fn) {
        const builder = new SelectBuilder_1.SelectBuilder();
        fn.call(builder, builder);
        return datatypes_1.SubQueryNode({ ast: builder.getAst() });
    }
}
exports.ViewBuilder = ViewBuilder;
