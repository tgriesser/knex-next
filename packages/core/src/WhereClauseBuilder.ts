import {
  TOperator,
  TColumnArg,
  TColumnConditions,
  TAndOr,
  TValueConditions,
  SubQueryArg,
  ChainFnWhere,
  Maybe,
  TValueArg,
} from "./data/types";
import {
  IRawNode,
  OperatorEnum,
  whereClauseNode,
  DialectEnum,
  TSelectOperation,
  WhereSubNode,
  TWhereClause,
  TDeleteOperation,
  WhereExprNode,
  TUpdateOperation,
  WhereNullNode,
  TSubQueryNode,
} from "./data/datatypes";
import { Grammar } from "./Grammar";
import { unpackValue, unpackColumn } from "./data/utils";

type TNot = OperatorEnum.NOT | null;

interface SubWhere {
  (this: SubWhereBuilder, arg: SubWhereBuilder): any;
}

export abstract class WhereClauseBuilder {
  /**
   * Useful if we want to check the builder's dialect from userland.
   */
  public readonly dialect: Maybe<DialectEnum> = null;

  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected grammar = new Grammar();

  protected abstract ast:
    | TSelectOperation
    | TUpdateOperation
    | TDeleteOperation
    | TWhereClause;

  where(raw: IRawNode): this;
  where(fn: SubWhere): this;
  where(builder: WhereClauseBuilder): this;
  where(bool: boolean): this;
  where(obj: { [column: string]: any }): this;
  where(column: TColumnArg, value: any): this;
  where(column: TColumnArg, op: TOperator, value: any): this;
  where(conditions: TValueConditions): this;
  where(...args: any[]) {
    return this.addWhere(args, OperatorEnum.AND);
  }
  andWhere(raw: IRawNode): this;
  andWhere(fn: SubWhere): this;
  andWhere(builder: WhereClauseBuilder): this;
  andWhere(bool: boolean): this;
  andWhere(obj: { [column: string]: any }): this;
  andWhere(column: TColumnArg, value: any): this;
  andWhere(column: TColumnArg, op: TOperator, value: any): this;
  andWhere(conditions: TValueConditions): this;
  andWhere(...args: any[]) {
    return this.addWhere(args, OperatorEnum.AND);
  }
  orWhere(raw: IRawNode): this;
  orWhere(fn: SubWhere): this;
  orWhere(bool: boolean): this;
  orWhere(builder: WhereClauseBuilder): this;
  orWhere(obj: { [column: string]: any }): this;
  orWhere(column: TColumnArg, value: any): this;
  orWhere(column: TColumnArg, op: TOperator, value: any): this;
  orWhere(conditions: TValueConditions): this;
  orWhere(...args: any[]) {
    return this.addWhere(args, OperatorEnum.OR);
  }
  whereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  whereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  whereColumn(obj: { [column: string]: string }): this;
  whereColumn(conditions: TColumnConditions): this;
  whereColumn(...args: any[]) {
    return this.addWhereColumn(args, OperatorEnum.AND);
  }
  andWhereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  andWhereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  andWhereColumn(obj: { [column: string]: string }): this;
  andWhereColumn(conditions: TColumnConditions): this;
  andWhereColumn(...args: any[]) {
    return this.addWhereColumn(args, OperatorEnum.AND);
  }
  orWhereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  orWhereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  orWhereColumn(obj: { [column: string]: string }): this;
  orWhereColumn(conditions: TColumnConditions): this;
  orWhereColumn(...args: any[]) {
    return this.addWhere(args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereIn(columnA: TColumnArg, sub: SubQueryArg): this;
  whereIn(columnA: TColumnArg, values: any[]): this;
  whereIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.AND);
  }
  andWhereIn(columnA: TColumnArg, sub: SubQueryArg): this;
  andWhereIn(columnA: TColumnArg, values: any[]): this;
  andWhereIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.AND);
  }
  orWhereIn(columnA: TColumnArg, sub: SubQueryArg): this;
  orWhereIn(columnA: TColumnArg, values: any[]): this;
  orWhereIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.OR);
  }
  whereNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
  whereNotIn(columnA: TColumnArg, values: any[]): this;
  whereNotIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.AND);
  }
  andWhereNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
  andWhereNotIn(columnA: TColumnArg, values: any[]): this;
  andWhereNotIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.AND);
  }
  orWhereNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
  orWhereNotIn(columnA: TColumnArg, values: any[]): this;
  orWhereNotIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.OR);
  }
  whereNull(column: TColumnArg) {
    return this.addWhereNull(column, OperatorEnum.AND);
  }
  andWhereNull(column: TColumnArg) {
    return this.addWhereNull(column, OperatorEnum.AND);
  }
  orWhereNull(column: TColumnArg) {
    return this.addWhereNull(column, OperatorEnum.OR);
  }
  whereNotNull(column: TColumnArg) {
    return this.addWhereNull(column, OperatorEnum.OR, OperatorEnum.NOT);
  }
  andWhereNotNull(column: TColumnArg) {
    return this.addWhereNull(column, OperatorEnum.OR, OperatorEnum.NOT);
  }
  orWhereNotNull(column: TColumnArg) {
    return this.addWhereNull(column, OperatorEnum.AND, OperatorEnum.NOT);
  }
  whereBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.AND);
  }
  andWhereBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.AND);
  }
  orWhereBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.OR);
  }
  whereNotBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.AND, OperatorEnum.NOT);
  }
  andWhereNotBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orWhereNotBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  /**
   * Date Helpers:
   */
  whereDate(...args: any[]) {
    return this.addWhereDate();
  }
  orWhereDate(...args: any[]) {
    return this.addWhereDate();
  }
  whereTime(...args: any[]) {
    return this.addWhereDate();
  }
  orWhereTime(...args: any[]) {
    return this.addWhereDate();
  }
  whereDay(...args: any[]) {
    return this.addWhereDate();
  }
  orWhereDay(...args: any[]) {
    return this.addWhereDate();
  }
  whereMonth(...args: any[]) {
    return this.addWhereDate();
  }
  orWhereMonth(...args: any[]) {
    return this.addWhereDate();
  }
  whereYear(...args: any[]) {
    return this.addWhereDate();
  }
  orWhereYear(...args: any[]) {
    return this.addWhereDate();
  }
  protected addWhere(args: any[], andOr: TAndOr, not: TNot = null): this {
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
  protected addWhereColumn(args: any[], andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected addWhereExpression(
    column: TColumnArg,
    operator: TOperator,
    val: TValueArg,
    andOr: TAndOr,
    not: TNot = null
  ) {
    return this.chain((ast: TWhereClause) => {
      return ast.set(
        "where",
        ast.where.push(
          WhereExprNode({
            not,
            andOr,
            column: unpackColumn(column),
            operator,
            value: unpackValue(val),
          })
        )
      );
    });
  }

  protected addWhereIn(
    args: [TColumnArg, SubQueryArg] | [TColumnArg, any],
    andOr: TAndOr,
    not: TNot = null
  ) {
    return this;
  }

  protected addWhereNull(column: TColumnArg, andOr: TAndOr, not: TNot = null) {
    return this.chain(ast =>
      ast.set(
        "where",
        ast.where.push(
          WhereNullNode({
            andOr,
            not,
            column: unpackColumn(column),
          })
        )
      )
    );
  }

  protected addWhereBetween(args: any[], andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected addWhereDate(): this {
    return this;
  }

  protected whereBool(bool: boolean, andOr: TAndOr, not: TNot) {
    return this.addWhere([1, "=", bool ? 1 : 0], andOr, not);
  }

  /**
   * Compile & add a subquery to the AST
   */
  protected whereSub(fn: SubWhere, andOr: TAndOr, not: TNot): this {
    return this.chain((ast: TWhereClause) => {
      const builder = new SubWhereBuilder(
        this.grammar.newInstance(),
        this.dialect,
        (fn: SubQueryArg) => this.subQuery(fn)
      );
      fn.call(builder, builder);
      return ast.set(
        "where",
        ast.where.push(WhereSubNode({ not, andOr, ast: builder.getAst() }))
      );
    });
  }

  abstract getAst(): WhereClauseBuilder["ast"];

  protected abstract chain(fn: ChainFnWhere): this;

  protected abstract subQuery(fn: SubQueryArg): TSubQueryNode;
}

export class SubWhereBuilder extends WhereClauseBuilder {
  constructor(
    protected grammar: Grammar,
    public readonly dialect: Maybe<DialectEnum>,
    protected subQuery: ((fn: SubQueryArg) => TSubQueryNode),
    protected ast = whereClauseNode
  ) {
    super();
  }
  getAst(): TWhereClause {
    return this.ast;
  }
  toOperation() {
    return this.grammar.toClause(this.ast);
  }
  protected chain(fn: ChainFnWhere) {
    this.ast = fn(this.ast);
    return this;
  }
}
