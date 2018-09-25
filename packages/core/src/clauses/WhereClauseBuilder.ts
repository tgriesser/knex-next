import { OperatorEnum, ClauseTypeEnum } from "../data/enums";
import { whereClauseNode } from "../data/structs";
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
} from "../data/types";
import { Grammar } from "../Grammar";
import { AddCondition } from "@knex/core/src/clauses/AddCondition";

export abstract class WhereClauseBuilder extends AddCondition {
  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected grammar = new Grammar();

  /**
   * All of the operation asts for builders inheriting the "WhereClauseBuilder"
   */
  protected abstract ast: TSelectOperation | TUpdateOperation | TDeleteOperation | TWhereClause;

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
    return this.addColumnCond(args, OperatorEnum.AND);
  }
  orWhereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  orWhereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  orWhereColumn(obj: { [column: string]: TColumnArg }): this;
  orWhereColumn(conditions: TColumnConditions): this;
  orWhereColumn(...args: any[]) {
    return this.addColumnCond(args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereIn(columnA: TColumnArg, sub: SubQueryArg): this;
  whereIn(columnA: TColumnArg, values: any[]): this;
  whereIn(...args: any[]) {
    return this.addInCond(args as any, OperatorEnum.AND);
  }
  orWhereIn(columnA: TColumnArg, sub: SubQueryArg): this;
  orWhereIn(columnA: TColumnArg, values: any[]): this;
  orWhereIn(...args: any[]) {
    return this.addInCond(args as any, OperatorEnum.OR);
  }
  whereNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
  whereNotIn(columnA: TColumnArg, values: any[]): this;
  whereNotIn(...args: any[]) {
    return this.addInCond(args as any, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orWhereNotIn(columnA: TColumnArg, sub: SubQueryArg): this;
  orWhereNotIn(columnA: TColumnArg, values: any[]): this;
  orWhereNotIn(...args: any[]) {
    return this.addInCond(args as any, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.AND);
  }
  andWhereNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.AND);
  }
  orWhereNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.OR);
  }
  whereNotNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.OR, OperatorEnum.NOT);
  }
  andWhereNotNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.OR, OperatorEnum.NOT);
  }
  orWhereNotNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.WHERE, column, OperatorEnum.AND, OperatorEnum.NOT);
  }
  whereBetween(...args: any[]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND);
  }
  andWhereBetween(...args: any[]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND);
  }
  orWhereBetween(...args: any[]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, args, OperatorEnum.OR);
  }
  whereNotBetween(...args: any[]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND, OperatorEnum.NOT);
  }
  andWhereNotBetween(...args: any[]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orWhereNotBetween(...args: any[]) {
    return this.addBetweenCond(ClauseTypeEnum.WHERE, args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND);
  }
  andWhereExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND);
  }
  orWhereExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND);
  }
  whereNotExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }
  andWhereNotExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orWhereNotExists(subQuery: SubQueryArg) {
    return this.addExistsCond(ClauseTypeEnum.WHERE, subQuery, OperatorEnum.AND, OperatorEnum.NOT);
  }

  /**
   * Date Helpers:
   */
  whereTime(...args: any[]) {
    return this.addDateCond();
  }
  orWhereTime(...args: any[]) {
    return this.addDateCond();
  }
  whereDay(...args: any[]) {
    return this.addDateCond();
  }
  orWhereDay(...args: any[]) {
    return this.addDateCond();
  }
  whereMonth(...args: any[]) {
    return this.addDateCond();
  }
  orWhereMonth(...args: any[]) {
    return this.addDateCond();
  }
  whereYear(...args: any[]) {
    return this.addDateCond();
  }
  orWhereYear(...args: any[]) {
    return this.addDateCond();
  }

  abstract getAst(): WhereClauseBuilder["ast"];

  protected abstract chain(fn: ChainFnWhere): this;

  protected abstract subQuery(fn: SubQueryArg): TSubQueryNode;
}

export interface WhereClauseBuilder {
  andWhere: WhereClauseBuilder["where"];
  andWhereIn: WhereClauseBuilder["whereIn"];
  andWhereNotIn: WhereClauseBuilder["whereNotIn"];
}
WhereClauseBuilder.prototype.andWhere = WhereClauseBuilder.prototype.where;
WhereClauseBuilder.prototype.andWhereIn = WhereClauseBuilder.prototype.whereIn;

export class SubWhereBuilder extends WhereClauseBuilder {
  constructor(
    protected grammar: Grammar,
    protected subQuery: ((fn: SubQueryArg) => TSubQueryNode),
    protected ast = whereClauseNode
  ) {
    super();
  }
  getAst(): TWhereClause {
    return this.ast;
  }
  protected chain(fn: ChainFnWhere) {
    this.ast = fn(this.ast);
    return this;
  }
}
