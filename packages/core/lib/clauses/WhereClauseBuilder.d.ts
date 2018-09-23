import { TOperator, TColumnArg, TColumnConditions, TAndOr, TValueConditions, SubQueryArg, ChainFnWhere, Maybe, TValueArg } from "../data/types";
import { IRawNode, OperatorEnum, DialectEnum, TSelectOperation, TWhereClause, TDeleteOperation, TUpdateOperation, TSubQueryNode } from "../data/datatypes";
import { Grammar } from "../Grammar";
declare type TNot = OperatorEnum.NOT | null;
interface SubWhere {
    (this: SubWhereBuilder, arg: SubWhereBuilder): any;
}
export declare abstract class WhereClauseBuilder {
    /**
     * Useful if we want to check the builder's dialect from userland.
     */
    readonly dialect: Maybe<DialectEnum>;
    /**
     * Grammar deals with escaping / parameterizing values
     */
    protected grammar: Grammar;
    protected abstract ast: TSelectOperation | TUpdateOperation | TDeleteOperation | TWhereClause;
    where(raw: IRawNode): this;
    where(fn: SubWhere): this;
    where(builder: WhereClauseBuilder): this;
    where(bool: boolean): this;
    where(obj: {
        [column: string]: any;
    }): this;
    where(column: TColumnArg, value: any): this;
    where(column: TColumnArg, op: TOperator, value: any): this;
    where(conditions: TValueConditions): this;
    andWhere(raw: IRawNode): this;
    andWhere(fn: SubWhere): this;
    andWhere(builder: WhereClauseBuilder): this;
    andWhere(bool: boolean): this;
    andWhere(obj: {
        [column: string]: any;
    }): this;
    andWhere(column: TColumnArg, value: any): this;
    andWhere(column: TColumnArg, op: TOperator, value: any): this;
    andWhere(conditions: TValueConditions): this;
    orWhere(raw: IRawNode): this;
    orWhere(fn: SubWhere): this;
    orWhere(bool: boolean): this;
    orWhere(builder: WhereClauseBuilder): this;
    orWhere(obj: {
        [column: string]: any;
    }): this;
    orWhere(column: TColumnArg, value: any): this;
    orWhere(column: TColumnArg, op: TOperator, value: any): this;
    orWhere(conditions: TValueConditions): this;
    whereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
    whereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
    whereColumn(obj: {
        [column: string]: string;
    }): this;
    whereColumn(conditions: TColumnConditions): this;
    andWhereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
    andWhereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
    andWhereColumn(obj: {
        [column: string]: string;
    }): this;
    andWhereColumn(conditions: TColumnConditions): this;
    orWhereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
    orWhereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
    orWhereColumn(obj: {
        [column: string]: string;
    }): this;
    orWhereColumn(conditions: TColumnConditions): this;
    whereIn(columnA: TColumnArg, sub: SubQueryArg): this;
    whereIn(columnA: TColumnArg, values: any[]): this;
    andWhereIn(columnA: TColumnArg, sub: SubQueryArg): this;
    andWhereIn(columnA: TColumnArg, values: any[]): this;
    orWhereIn(columnA: TColumnArg, sub: SubQueryArg): this;
    orWhereIn(columnA: TColumnArg, values: any[]): this;
    whereNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
    whereNotIn(columnA: TColumnArg, values: any[]): this;
    andWhereNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
    andWhereNotIn(columnA: TColumnArg, values: any[]): this;
    orWhereNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
    orWhereNotIn(columnA: TColumnArg, values: any[]): this;
    whereNull(column: TColumnArg): this;
    andWhereNull(column: TColumnArg): this;
    orWhereNull(column: TColumnArg): this;
    whereNotNull(column: TColumnArg): this;
    andWhereNotNull(column: TColumnArg): this;
    orWhereNotNull(column: TColumnArg): this;
    whereBetween(...args: any[]): this;
    andWhereBetween(...args: any[]): this;
    orWhereBetween(...args: any[]): this;
    whereNotBetween(...args: any[]): this;
    andWhereNotBetween(...args: any[]): this;
    orWhereNotBetween(...args: any[]): this;
    /**
     * Date Helpers:
     */
    whereDate(...args: any[]): this;
    orWhereDate(...args: any[]): this;
    whereTime(...args: any[]): this;
    orWhereTime(...args: any[]): this;
    whereDay(...args: any[]): this;
    orWhereDay(...args: any[]): this;
    whereMonth(...args: any[]): this;
    orWhereMonth(...args: any[]): this;
    whereYear(...args: any[]): this;
    orWhereYear(...args: any[]): this;
    protected addWhere(args: any[], andOr: TAndOr, not?: TNot): this;
    protected addWhereColumn(args: any[], andOr: TAndOr, not?: TNot): this;
    protected addWhereExpression(column: TColumnArg, operator: TOperator, val: TValueArg, andOr: TAndOr, not?: TNot): this;
    protected addWhereIn(args: [TColumnArg, SubQueryArg] | [TColumnArg, any], andOr: TAndOr, not?: TNot): this;
    protected addWhereNull(column: TColumnArg, andOr: TAndOr, not?: TNot): this;
    protected addWhereBetween(args: any[], andOr: TAndOr, not?: TNot): this;
    protected addWhereDate(): this;
    protected whereBool(bool: boolean, andOr: TAndOr, not: TNot): this;
    /**
     * Compile & add a subquery to the AST
     */
    protected whereSub(fn: SubWhere, andOr: TAndOr, not: TNot): this;
    abstract getAst(): WhereClauseBuilder["ast"];
    protected abstract chain(fn: ChainFnWhere): this;
    protected abstract subQuery(fn: SubQueryArg): TSubQueryNode;
}
export declare class SubWhereBuilder extends WhereClauseBuilder {
    protected grammar: Grammar;
    readonly dialect: Maybe<DialectEnum>;
    protected subQuery: ((fn: SubQueryArg) => TSubQueryNode);
    protected ast: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IWhereClauseNodes>;
    constructor(grammar: Grammar, dialect: Maybe<DialectEnum>, subQuery: ((fn: SubQueryArg) => TSubQueryNode), ast?: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IWhereClauseNodes>);
    getAst(): TWhereClause;
    toOperation(): import("@knex/core/src/Grammar").ToSQLValue;
    protected chain(fn: ChainFnWhere): this;
}
export {};
