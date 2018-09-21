"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SelectBuilder_1 = require("../SelectBuilder");
class PostgresQueryBuilder extends SelectBuilder_1.SelectBuilder {
    constructor() {
        super(...arguments);
        this.operators = new Set([
            "=",
            "<",
            ">",
            "<=",
            ">=",
            "<>",
            "!=",
            "like",
            "not like",
            "between",
            "ilike",
            "not ilike",
            "~",
            "&",
            "|",
            "#",
            "<<",
            ">>",
            "<<=",
            ">>=",
            "&&",
            "@>",
            "<@",
            "?",
            "?|",
            "?&",
            "||",
            "-",
            "-",
            "#-",
            "is distinct from",
            "is not distinct from",
        ]);
    }
}
exports.PostgresQueryBuilder = PostgresQueryBuilder;
