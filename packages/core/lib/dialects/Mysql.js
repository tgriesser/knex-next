"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SelectBuilder_1 = require("../SelectBuilder");
const Grammar_1 = require("../Grammar");
class MysqlGrammar extends Grammar_1.Grammar {
}
exports.MysqlGrammar = MysqlGrammar;
class MysqlSelectBuilder extends SelectBuilder_1.SelectBuilder {
    constructor() {
        super(...arguments);
        this.grammar = new MysqlGrammar();
    }
}
exports.MysqlSelectBuilder = MysqlSelectBuilder;
