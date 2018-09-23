"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatypes_1 = require("../data/datatypes");
const Grammar_1 = require("../Grammar");
const utils_1 = require("../data/utils");
class WhereClauseBuilder {
    constructor() {
        /**
         * Useful if we want to check the builder's dialect from userland.
         */
        this.dialect = null;
        /**
         * Grammar deals with escaping / parameterizing values
         */
        this.grammar = new Grammar_1.Grammar();
    }
    where(...args) {
        return this.addWhere(args, datatypes_1.OperatorEnum.AND);
    }
    andWhere(...args) {
        return this.addWhere(args, datatypes_1.OperatorEnum.AND);
    }
    orWhere(...args) {
        return this.addWhere(args, datatypes_1.OperatorEnum.OR);
    }
    whereColumn(...args) {
        return this.addWhereColumn(args, datatypes_1.OperatorEnum.AND);
    }
    andWhereColumn(...args) {
        return this.addWhereColumn(args, datatypes_1.OperatorEnum.AND);
    }
    orWhereColumn(...args) {
        return this.addWhere(args, datatypes_1.OperatorEnum.OR, datatypes_1.OperatorEnum.NOT);
    }
    whereIn(...args) {
        return this.addWhereIn(args, datatypes_1.OperatorEnum.AND);
    }
    andWhereIn(...args) {
        return this.addWhereIn(args, datatypes_1.OperatorEnum.AND);
    }
    orWhereIn(...args) {
        return this.addWhereIn(args, datatypes_1.OperatorEnum.OR);
    }
    whereNotIn(...args) {
        return this.addWhereIn(args, datatypes_1.OperatorEnum.AND);
    }
    andWhereNotIn(...args) {
        return this.addWhereIn(args, datatypes_1.OperatorEnum.AND);
    }
    orWhereNotIn(...args) {
        return this.addWhereIn(args, datatypes_1.OperatorEnum.OR);
    }
    whereNull(column) {
        return this.addWhereNull(column, datatypes_1.OperatorEnum.AND);
    }
    andWhereNull(column) {
        return this.addWhereNull(column, datatypes_1.OperatorEnum.AND);
    }
    orWhereNull(column) {
        return this.addWhereNull(column, datatypes_1.OperatorEnum.OR);
    }
    whereNotNull(column) {
        return this.addWhereNull(column, datatypes_1.OperatorEnum.OR, datatypes_1.OperatorEnum.NOT);
    }
    andWhereNotNull(column) {
        return this.addWhereNull(column, datatypes_1.OperatorEnum.OR, datatypes_1.OperatorEnum.NOT);
    }
    orWhereNotNull(column) {
        return this.addWhereNull(column, datatypes_1.OperatorEnum.AND, datatypes_1.OperatorEnum.NOT);
    }
    whereBetween(...args) {
        return this.addWhereBetween(args, datatypes_1.OperatorEnum.AND);
    }
    andWhereBetween(...args) {
        return this.addWhereBetween(args, datatypes_1.OperatorEnum.AND);
    }
    orWhereBetween(...args) {
        return this.addWhereBetween(args, datatypes_1.OperatorEnum.OR);
    }
    whereNotBetween(...args) {
        return this.addWhereBetween(args, datatypes_1.OperatorEnum.AND, datatypes_1.OperatorEnum.NOT);
    }
    andWhereNotBetween(...args) {
        return this.addWhereBetween(args, datatypes_1.OperatorEnum.AND, datatypes_1.OperatorEnum.NOT);
    }
    orWhereNotBetween(...args) {
        return this.addWhereBetween(args, datatypes_1.OperatorEnum.OR, datatypes_1.OperatorEnum.NOT);
    }
    /**
     * Date Helpers:
     */
    whereDate(...args) {
        return this.addWhereDate();
    }
    orWhereDate(...args) {
        return this.addWhereDate();
    }
    whereTime(...args) {
        return this.addWhereDate();
    }
    orWhereTime(...args) {
        return this.addWhereDate();
    }
    whereDay(...args) {
        return this.addWhereDate();
    }
    orWhereDay(...args) {
        return this.addWhereDate();
    }
    whereMonth(...args) {
        return this.addWhereDate();
    }
    orWhereMonth(...args) {
        return this.addWhereDate();
    }
    whereYear(...args) {
        return this.addWhereDate();
    }
    orWhereYear(...args) {
        return this.addWhereDate();
    }
    addWhere(args, andOr, not = null) {
        switch (args.length) {
            case 1: {
                if (typeof args[0] === "function") {
                    return this.whereSub(args[0], andOr, not);
                }
                if (typeof args[0] === "boolean") {
                    return this.whereBool(args[0], andOr, not);
                }
                break;
            }
            case 2: {
                if (args[1] === null) {
                    return this.whereNull(args[0]);
                }
                return this.addWhereExpression(args[0], "=", args[1], andOr, not);
            }
        }
        return this;
    }
    addWhereColumn(args, andOr, not = null) {
        return this;
    }
    addWhereExpression(column, operator, val, andOr, not = null) {
        return this.chain((ast) => {
            return ast.set("where", ast.where.push(datatypes_1.WhereExprNode({
                not,
                andOr,
                column: utils_1.unpackColumn(column),
                operator,
                value: utils_1.unpackValue(val),
            })));
        });
    }
    addWhereIn(args, andOr, not = null) {
        return this;
    }
    addWhereNull(column, andOr, not = null) {
        return this.chain(ast => ast.set("where", ast.where.push(datatypes_1.WhereNullNode({
            andOr,
            not,
            column: utils_1.unpackColumn(column),
        }))));
    }
    addWhereBetween(args, andOr, not = null) {
        return this;
    }
    addWhereDate() {
        return this;
    }
    whereBool(bool, andOr, not) {
        return this.addWhere([1, "=", bool ? 1 : 0], andOr, not);
    }
    /**
     * Compile & add a subquery to the AST
     */
    whereSub(fn, andOr, not) {
        return this.chain((ast) => {
            const builder = new SubWhereBuilder(this.grammar.newInstance(), this.dialect, (fn) => this.subQuery(fn));
            fn.call(builder, builder);
            return ast.set("where", ast.where.push(datatypes_1.WhereSubNode({ not, andOr, ast: builder.getAst() })));
        });
    }
}
exports.WhereClauseBuilder = WhereClauseBuilder;
class SubWhereBuilder extends WhereClauseBuilder {
    constructor(grammar, dialect, subQuery, ast = datatypes_1.whereClauseNode) {
        super();
        this.grammar = grammar;
        this.dialect = dialect;
        this.subQuery = subQuery;
        this.ast = ast;
    }
    getAst() {
        return this.ast;
    }
    toOperation() {
        return this.grammar.toClause(this.ast);
    }
    chain(fn) {
        this.ast = fn(this.ast);
        return this;
    }
}
exports.SubWhereBuilder = SubWhereBuilder;
