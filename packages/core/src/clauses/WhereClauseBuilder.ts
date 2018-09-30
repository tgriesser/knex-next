import { OperatorEnum, ClauseTypeEnum, DateCondType } from "../data/enums";
import {
  ChainFnWhere,
  IRawNode,
  IWrappedWhere,
  SubQueryArg,
  TColumnArg,
  TColumnConditions,
  TDeleteOperation,
  TOperator,
  TSelectOperation,
  TSubQueryNode,
  TUpdateOperation,
  TValueConditions,
  TWhereClause,
  TValueArg,
  TInArg,
  TConditionNode,
  TAndOr,
  TNot,
  TDateCondArgs,
  TOperatorArg,
} from "../data/types";
import { Grammar } from "../Grammar";
import { AddCondition } from "./AddCondition";
import { List } from "immutable";

export abstract class WhereClauseBuilder extends AddCondition {
  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected abstract grammar: Grammar;

  /**
   * All of the operation asts for builders inheriting the "WhereClauseBuilder"
   */
  protected abstract ast: TSelectOperation | TUpdateOperation | TDeleteOperation | TWhereClause | List<TConditionNode>;

  where(raw: IRawNode): this;
  where(fn: IWrappedWhere): this;
  where(builder: WhereClauseBuilder): this;
  where(bool: boolean): this;
  where(obj: { [column: string]: TValueArg }): this;
  where(column: TColumnArg, value: TValueArg): this;
  where(column: TColumnArg, op: TOperator, value: TValueArg): this;
  where(conditions: TValueConditions): this;
  where(...args: any[]) {
    return this.addCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND);
  }
  orWhere(raw: IRawNode): this;
  orWhere(fn: IWrappedWhere): this;
  orWhere(bool: boolean): this;
  orWhere(builder: WhereClauseBuilder): this;
  orWhere(obj: { [column: string]: TValueArg }): this;
  orWhere(column: TColumnArg, value: TValueArg): this;
  orWhere(column: TColumnArg, op: TOperator, value: TValueArg): this;
  orWhere(conditions: TValueConditions): this;
  orWhere(...args: any[]) {
    return this.addCond(ClauseTypeEnum.WHERE, args, OperatorEnum.OR);
  }
  whereNot(raw: IRawNode): this;
  whereNot(fn: IWrappedWhere): this;
  whereNot(builder: WhereClauseBuilder): this;
  whereNot(bool: boolean): this;
  whereNot(obj: { [column: string]: TValueArg }): this;
  whereNot(column: TColumnArg, value: TValueArg): this;
  whereNot(column: TColumnArg, op: TOperator, value: TValueArg): this;
  whereNot(conditions: TValueConditions): this;
  whereNot(...args: any[]) {
    return this.addCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND);
  }
  orWhereNot(raw: IRawNode): this;
  orWhereNot(fn: IWrappedWhere): this;
  orWhereNot(bool: boolean): this;
  orWhereNot(builder: WhereClauseBuilder): this;
  orWhereNot(obj: { [column: string]: TValueArg }): this;
  orWhereNot(column: TColumnArg, value: TValueArg): this;
  orWhereNot(column: TColumnArg, op: TOperator, value: TValueArg): this;
  orWhereNot(conditions: TValueConditions): this;
  orWhereNot(...args: any[]) {
    return this.addCond(ClauseTypeEnum.WHERE, args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  whereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  whereColumn(obj: { [column: string]: string }): this;
  whereColumn(conditions: TColumnConditions): this;
  whereColumn(...args: any[]) {
    return this.addColumnCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND);
  }
  orWhereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  orWhereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  orWhereColumn(obj: { [column: string]: TColumnArg }): this;
  orWhereColumn(conditions: TColumnConditions): this;
  orWhereColumn(...args: any[]) {
    return this.addColumnCond(ClauseTypeEnum.WHERE, args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.WHERE, column, arg, OperatorEnum.AND);
  }
  orWhereIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.WHERE, column, arg, OperatorEnum.OR);
  }
  whereNotIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.WHERE, column, arg, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orWhereNotIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.WHERE, column, arg, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.AND);
  }
  orWhereNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.OR);
  }
  whereNotNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.OR, OperatorEnum.NOT);
  }
  orWhereNotNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.AND, OperatorEnum.NOT);
  }
  whereBetween(column: TColumnArg, between: [TValueArg, TValueArg]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, column, between, OperatorEnum.AND);
  }
  orWhereBetween(column: TColumnArg, between: [TValueArg, TValueArg]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, column, between, OperatorEnum.OR);
  }
  whereNotBetween(column: TColumnArg, between: [TValueArg, TValueArg]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, column, between, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orWhereNotBetween(column: TColumnArg, between: [TValueArg, TValueArg]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, column, between, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND);
  }
  orWhereExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND);
  }
  whereNotExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orWhereNotExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }

  /**
   * Date Helpers:
   */
  whereDate(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  whereDate(column: TColumnArg, value: TValueArg): this;
  whereDate(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.DATE, column, operator, value, OperatorEnum.AND);
  }
  orWhereDate(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  orWhereDate(column: TColumnArg, value: TValueArg): this;
  orWhereDate(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.DATE, column, operator, value, OperatorEnum.OR);
  }
  whereTime(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  whereTime(column: TColumnArg, value: TValueArg): this;
  whereTime(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.TIME, column, operator, value, OperatorEnum.AND);
  }
  orWhereTime(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  orWhereTime(column: TColumnArg, value: TValueArg): this;
  orWhereTime(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.TIME, column, operator, value, OperatorEnum.OR);
  }
  whereDay(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  whereDay(column: TColumnArg, value: TValueArg): this;
  whereDay(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.DAY, column, operator, value, OperatorEnum.AND);
  }
  orWhereDay(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  orWhereDay(column: TColumnArg, value: TValueArg): this;
  orWhereDay(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.DAY, column, operator, value, OperatorEnum.OR);
  }
  whereMonth(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  whereMonth(column: TColumnArg, value: TValueArg): this;
  whereMonth(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.MONTH, column, operator, value, OperatorEnum.AND);
  }
  orWhereMonth(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  orWhereMonth(column: TColumnArg, value: TValueArg): this;
  orWhereMonth(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.MONTH, column, operator, value, OperatorEnum.OR);
  }
  whereYear(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  whereYear(column: TColumnArg, value: TValueArg): this;
  whereYear(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.YEAR, column, operator, value, OperatorEnum.AND);
  }
  orWhereYear(column: TColumnArg, operator: TOperatorArg, value: TValueArg): this;
  orWhereYear(column: TColumnArg, value: TValueArg): this;
  orWhereYear(...args: any[]) {
    const [column, operator, value] = this.normalizeExprArgs(args as TDateCondArgs);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.YEAR, column, operator, value, OperatorEnum.OR);
  }

  abstract getAst(): WhereClauseBuilder["ast"];

  protected abstract chain(fn: ChainFnWhere): this;

  protected abstract subQuery(fn: SubQueryArg): TSubQueryNode;
}

export interface WhereClauseBuilder {
  andWhere: WhereClauseBuilder["where"];
  andWhereIn: WhereClauseBuilder["whereIn"];
  andWhereNotIn: WhereClauseBuilder["whereNotIn"];
  andWhereNull: WhereClauseBuilder["whereNull"];
  andWhereNotNull: WhereClauseBuilder["whereNotNull"];
  andWhereBetween: WhereClauseBuilder["whereBetween"];
  andWhereNotBetween: WhereClauseBuilder["whereNotBetween"];
  andWhereExists: WhereClauseBuilder["whereExists"];
  andWhereNotExists: WhereClauseBuilder["whereNotExists"];
}
WhereClauseBuilder.prototype.andWhere = WhereClauseBuilder.prototype.where;
WhereClauseBuilder.prototype.andWhereIn = WhereClauseBuilder.prototype.whereIn;
WhereClauseBuilder.prototype.andWhereNotIn = WhereClauseBuilder.prototype.whereNotIn;
WhereClauseBuilder.prototype.andWhereNull = WhereClauseBuilder.prototype.whereNull;
WhereClauseBuilder.prototype.andWhereNotNull = WhereClauseBuilder.prototype.whereNotNull;
WhereClauseBuilder.prototype.andWhereBetween = WhereClauseBuilder.prototype.whereBetween;
WhereClauseBuilder.prototype.andWhereNotBetween = WhereClauseBuilder.prototype.whereNotBetween;
WhereClauseBuilder.prototype.andWhereExists = WhereClauseBuilder.prototype.whereExists;
WhereClauseBuilder.prototype.andWhereNotExists = WhereClauseBuilder.prototype.whereNotExists;

export class SubWhereBuilder extends WhereClauseBuilder {
  protected ast = List<TConditionNode>();

  constructor(protected grammar: Grammar, protected subQuery: ((fn: SubQueryArg) => TSubQueryNode)) {
    super();
  }
  getAst() {
    return this.ast;
  }

  protected pushCondition(clauseType: ClauseTypeEnum.WHERE, node: TConditionNode) {
    this.ast = this.ast.push(node);
    return this;
  }

  protected subCondition(clauseType: ClauseTypeEnum.WHERE, fn: Function, andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected chain(fn: ChainFnWhere) {
    this.ast = fn(this.ast);
    return this;
  }
}
