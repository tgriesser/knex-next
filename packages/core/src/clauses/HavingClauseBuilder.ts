import { DialectEnum, OperatorEnum } from "../data/enums";
import { whereClauseNode, WhereSubNode, WhereExprNode, WhereNullNode } from "../data/structs";
import {
  ChainFnHaving,
  IRawNode,
  IWrappedHaving,
  Maybe,
  SubQueryArg,
  TAndOr,
  TColumnArg,
  TColumnConditions,
  TNot,
  TOperator,
  TSelectOperation,
  TSubQueryNode,
  TValueArg,
  TValueConditions,
  TWhereClause,
} from "../data/types";
import { unpackColumn, unpackValue } from "../data/utils";
import { Grammar } from "../Grammar";

export abstract class HavingClauseBuilder {
  /**
   * Useful if we want to check the builder's dialect from userland.
   */
  public readonly dialect: Maybe<DialectEnum> = null;

  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected grammar = new Grammar();

  protected abstract ast: TSelectOperation | TWhereClause;

  having(raw: IRawNode): this;
  having(fn: IWrappedHaving): this;
  having(builder: HavingClauseBuilder): this;
  having(bool: boolean): this;
  having(obj: { [column: string]: any }): this;
  having(column: TColumnArg, value: any): this;
  having(column: TColumnArg, op: TOperator, value: any): this;
  having(conditions: TValueConditions): this;
  having(...args: any[]) {
    return this.addHaving(args, OperatorEnum.AND);
  }
  andHaving(raw: IRawNode): this;
  andHaving(fn: IWrappedHaving): this;
  andHaving(builder: HavingClauseBuilder): this;
  andHaving(bool: boolean): this;
  andHaving(obj: { [column: string]: any }): this;
  andHaving(column: TColumnArg, value: any): this;
  andHaving(column: TColumnArg, op: TOperator, value: any): this;
  andHaving(conditions: TValueConditions): this;
  andHaving(...args: any[]) {
    return this.addHaving(args, OperatorEnum.AND);
  }
  orHaving(raw: IRawNode): this;
  orHaving(fn: IWrappedHaving): this;
  orHaving(bool: boolean): this;
  orHaving(builder: HavingClauseBuilder): this;
  orHaving(obj: { [column: string]: any }): this;
  orHaving(column: TColumnArg, value: any): this;
  orHaving(column: TColumnArg, op: TOperator, value: any): this;
  orHaving(conditions: TValueConditions): this;
  orHaving(...args: any[]) {
    return this.addHaving(args, OperatorEnum.OR);
  }
  havingColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  havingColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  havingColumn(obj: { [column: string]: string }): this;
  havingColumn(conditions: TColumnConditions): this;
  havingColumn(...args: any[]) {
    return this.addHavingColumn(args, OperatorEnum.AND);
  }
  andHavingColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  andHavingColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  andHavingColumn(obj: { [column: string]: string }): this;
  andHavingColumn(conditions: TColumnConditions): this;
  andHavingColumn(...args: any[]) {
    return this.addHavingColumn(args, OperatorEnum.AND);
  }
  orHavingColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  orHavingColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  orHavingColumn(obj: { [column: string]: string }): this;
  orHavingColumn(conditions: TColumnConditions): this;
  orHavingColumn(...args: any[]) {
    return this.addHaving(args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  havingIn(columnA: TColumnArg, sub: SubQueryArg): this;
  havingIn(columnA: TColumnArg, values: any[]): this;
  havingIn(...args: any[]) {
    return this.addHavingIn(args as any, OperatorEnum.AND);
  }
  andHavingIn(columnA: TColumnArg, sub: SubQueryArg): this;
  andHavingIn(columnA: TColumnArg, values: any[]): this;
  andHavingIn(...args: any[]) {
    return this.addHavingIn(args as any, OperatorEnum.AND);
  }
  orHavingIn(columnA: TColumnArg, sub: SubQueryArg): this;
  orHavingIn(columnA: TColumnArg, values: any[]): this;
  orHavingIn(...args: any[]) {
    return this.addHavingIn(args as any, OperatorEnum.OR);
  }
  havingNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
  havingNotIn(columnA: TColumnArg, values: any[]): this;
  havingNotIn(...args: any[]) {
    return this.addHavingIn(args as any, OperatorEnum.AND);
  }
  andHavingNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
  andHavingNotIn(columnA: TColumnArg, values: any[]): this;
  andHavingNotIn(...args: any[]) {
    return this.addHavingIn(args as any, OperatorEnum.AND);
  }
  orHavingNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
  orHavingNotIn(columnA: TColumnArg, values: any[]): this;
  orHavingNotIn(...args: any[]) {
    return this.addHavingIn(args as any, OperatorEnum.OR);
  }
  havingNull(column: TColumnArg) {
    return this.addHavingNull(column, OperatorEnum.AND);
  }
  andHavingNull(column: TColumnArg) {
    return this.addHavingNull(column, OperatorEnum.AND);
  }
  orHavingNull(column: TColumnArg) {
    return this.addHavingNull(column, OperatorEnum.OR);
  }
  havingNotNull(column: TColumnArg) {
    return this.addHavingNull(column, OperatorEnum.OR, OperatorEnum.NOT);
  }
  andHavingNotNull(column: TColumnArg) {
    return this.addHavingNull(column, OperatorEnum.OR, OperatorEnum.NOT);
  }
  orHavingNotNull(column: TColumnArg) {
    return this.addHavingNull(column, OperatorEnum.AND, OperatorEnum.NOT);
  }
  havingBetween(...args: any[]) {
    return this.addHavingBetween(args, OperatorEnum.AND);
  }
  andHavingBetween(...args: any[]) {
    return this.addHavingBetween(args, OperatorEnum.AND);
  }
  orHavingBetween(...args: any[]) {
    return this.addHavingBetween(args, OperatorEnum.OR);
  }
  havingNotBetween(...args: any[]) {
    return this.addHavingBetween(args, OperatorEnum.AND, OperatorEnum.NOT);
  }
  andHavingNotBetween(...args: any[]) {
    return this.addHavingBetween(args, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orHavingNotBetween(...args: any[]) {
    return this.addHavingBetween(args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  havingExists(subQuery: SubQueryArg) {
    return this.addHavingExists(subQuery, OperatorEnum.AND);
  }
  andHavingExists(subQuery: SubQueryArg) {
    return this.addHavingExists(subQuery, OperatorEnum.AND);
  }
  orHavingExists(subQuery: SubQueryArg) {
    return this.addHavingExists(subQuery, OperatorEnum.AND);
  }
  havingNotExists(subQuery: SubQueryArg) {
    return this.addHavingExists(subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }
  andHavingNotExists(subQuery: SubQueryArg) {
    return this.addHavingExists(subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orHavingNotExists(subQuery: SubQueryArg) {
    return this.addHavingExists(subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }

  protected addHaving(args: any[], andOr: TAndOr, not: TNot = null): this {
    switch (args.length) {
      case 1: {
        if (typeof args[0] === "function") {
          return this.havingSub(args[0], andOr, not);
        }
        if (typeof args[0] === "boolean") {
          return this.havingBool(args[0], andOr, not);
        }
        break;
      }
      case 2: {
        if (args[1] === null) {
          return this.havingNull(args[0]);
        }
        return this.addHavingExpression(args[0], "=", args[1], andOr, not);
      }
    }
    return this;
  }
  protected addHavingColumn(args: any[], andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected addHavingExpression(
    column: TColumnArg,
    operator: TOperator,
    val: TValueArg,
    andOr: TAndOr,
    not: TNot = null
  ) {
    return this.chain((ast: TWhereClause) => {
      return ast.set(
        "having",
        ast.having.push(
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

  protected addHavingIn(args: [TColumnArg, SubQueryArg] | [TColumnArg, any], andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected addHavingNull(column: TColumnArg, andOr: TAndOr, not: TNot = null) {
    return this.chain(ast =>
      ast.set(
        "having",
        ast.having.push(
          WhereNullNode({
            andOr,
            not,
            column: unpackColumn(column),
          })
        )
      )
    );
  }

  protected addHavingExists(subQuery: SubQueryArg, andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected addHavingBetween(args: any[], andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected addHavingDate(): this {
    return this;
  }

  protected havingBool(bool: boolean, andOr: TAndOr, not: TNot) {
    return this.addHaving([1, "=", bool ? 1 : 0], andOr, not);
  }

  /**
   * Compile & add a subquery to the AST
   */
  protected havingSub(fn: IWrappedHaving, andOr: TAndOr, not: TNot): this {
    return this.chain((ast: TWhereClause) => {
      const builder = new SubHavingBuilder(this.grammar.newInstance(), this.dialect, (fn: SubQueryArg) =>
        this.subQuery(fn)
      );
      fn.call(builder, builder);
      return ast.set("having", ast.having.push(WhereSubNode({ not, andOr, ast: builder.getAst() })));
    });
  }

  abstract getAst(): HavingClauseBuilder["ast"];

  protected abstract chain(fn: ChainFnHaving): this;

  protected abstract subQuery(fn: SubQueryArg): TSubQueryNode;
}

export class SubHavingBuilder extends HavingClauseBuilder {
  constructor(
    protected grammar: Grammar,
    public readonly dialect: Maybe<DialectEnum>,
    protected subQuery: ((fn: SubQueryArg) => TSubQueryNode),
    protected ast = whereClauseNode
  ) {
    super();
  }
  getAst() {
    return this.ast;
  }
  protected chain(fn: ChainFnHaving) {
    this.ast = fn(this.ast);
    return this;
  }
}
