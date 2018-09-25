import { DialectEnum, OperatorEnum, ClauseTypeEnum } from "../data/enums";
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
  TValueConditions,
  TConditionNode,
  TValueArg,
  TInArg,
} from "../data/types";
import { Grammar } from "../Grammar";
import { AddCondition } from "./AddCondition";
import { List } from "immutable";

export abstract class HavingClauseBuilder extends AddCondition {
  /**
   * Useful if we want to check the builder's dialect from userland.
   */
  public readonly dialect: Maybe<DialectEnum> = null;

  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected grammar = new Grammar();

  protected abstract ast: TSelectOperation | List<TConditionNode>;

  having(raw: IRawNode): this;
  having(fn: IWrappedHaving): this;
  having(builder: HavingClauseBuilder): this;
  having(bool: boolean): this;
  having(obj: { [column: string]: any }): this;
  having(column: TColumnArg, value: any): this;
  having(column: TColumnArg, op: TOperator, value: any): this;
  having(conditions: TValueConditions): this;
  having(...args: any[]) {
    return this.addCond(ClauseTypeEnum.HAVING, args, OperatorEnum.AND);
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
    return this.addCond(ClauseTypeEnum.HAVING, args, OperatorEnum.OR);
  }
  havingColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  havingColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  havingColumn(obj: { [column: string]: string }): this;
  havingColumn(conditions: TColumnConditions): this;
  havingColumn(...args: any[]) {
    return this.addColumnCond(ClauseTypeEnum.HAVING, args, OperatorEnum.AND);
  }
  orHavingColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  orHavingColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  orHavingColumn(obj: { [column: string]: string }): this;
  orHavingColumn(conditions: TColumnConditions): this;
  orHavingColumn(...args: any[]) {
    return this.addColumnCond(ClauseTypeEnum.HAVING, args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  havingIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.HAVING, column, arg, OperatorEnum.AND);
  }
  orHavingIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.HAVING, column, arg, OperatorEnum.OR);
  }
  havingNotIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.HAVING, column, arg, OperatorEnum.AND);
  }
  orHavingNotIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.HAVING, column, arg, OperatorEnum.OR);
  }
  havingNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.HAVING, column, OperatorEnum.AND);
  }
  orHavingNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.HAVING, column, OperatorEnum.OR);
  }
  havingNotNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.HAVING, column, OperatorEnum.OR, OperatorEnum.NOT);
  }
  orHavingNotNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.HAVING, column, OperatorEnum.AND, OperatorEnum.NOT);
  }
  havingBetween(column: TColumnArg, args: [TValueArg, TValueArg]) {
    return this.addBetweenCond(ClauseTypeEnum.HAVING, column, args, OperatorEnum.AND);
  }
  orHavingBetween(column: TColumnArg, args: [TValueArg, TValueArg]) {
    return this.addBetweenCond(ClauseTypeEnum.HAVING, column, args, OperatorEnum.OR);
  }
  havingNotBetween(column: TColumnArg, args: [TValueArg, TValueArg]) {
    return this.addBetweenCond(ClauseTypeEnum.HAVING, column, args, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orHavingNotBetween(column: TColumnArg, args: [TValueArg, TValueArg]) {
    return this.addBetweenCond(ClauseTypeEnum.HAVING, column, args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  havingExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.HAVING, subQuery, OperatorEnum.AND);
  }
  orHavingExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.HAVING, subQuery, OperatorEnum.AND);
  }
  havingNotExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.HAVING, subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orHavingNotExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.HAVING, subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }
  abstract getAst(): HavingClauseBuilder["ast"];

  protected abstract chain(fn: ChainFnHaving): this;

  protected abstract subQuery(fn: SubQueryArg): TSubQueryNode;
}

export interface HavingClauseBuilder {
  andHaving: HavingClauseBuilder["having"];
  andHavingColumn: HavingClauseBuilder["havingColumn"];
  andHavingIn: HavingClauseBuilder["havingIn"];
  andHavingNotIn: HavingClauseBuilder["havingNotIn"];
  andHavingNull: HavingClauseBuilder["havingNull"];
  andHavingNotNull: HavingClauseBuilder["havingNotNull"];
}

HavingClauseBuilder.prototype.andHaving = HavingClauseBuilder.prototype.having;
HavingClauseBuilder.prototype.andHavingColumn = HavingClauseBuilder.prototype.havingColumn;
HavingClauseBuilder.prototype.andHavingIn = HavingClauseBuilder.prototype.havingIn;
HavingClauseBuilder.prototype.andHavingNotIn = HavingClauseBuilder.prototype.havingNotIn;
HavingClauseBuilder.prototype.andHavingNull = HavingClauseBuilder.prototype.havingNull;
HavingClauseBuilder.prototype.andHavingNotNull = HavingClauseBuilder.prototype.havingNotNull;

export class SubHavingBuilder extends HavingClauseBuilder {
  protected ast = List();

  constructor(protected grammar: Grammar, protected subQuery: ((fn: SubQueryArg) => TSubQueryNode)) {
    super();
  }

  getAst() {
    return this.ast;
  }

  protected pushCondition(clauseType: ClauseTypeEnum.HAVING, node: TConditionNode) {
    this.ast = this.ast.push(node);
    return this;
  }

  protected subCondition(clauseType: ClauseTypeEnum.HAVING, fn: Function, andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected chain(fn: ChainFnHaving) {
    this.ast = fn(this.ast);
    return this;
  }
}
