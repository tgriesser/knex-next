import { OperatorEnum, ClauseTypeEnum, DateCondType } from "../data/enums";
import {
  ChainFnWhere,
  SubQueryArg,
  TColumnArg,
  TDeleteOperation,
  TSelectOperation,
  TSubQueryNode,
  TUpdateOperation,
  TWhereClause,
  TValueArg,
  TInArg,
  TConditionNode,
  TAndOr,
  TNot,
  TValueCondition,
  TConditionColumnArgs,
  TWhereConditionValueArgs,
  TWhereBuilderFn,
  TConditionValueArgs,
} from "../data/types";
import { Grammar } from "../Grammar";
import { AddCondition } from "./AddCondition";
import { List } from "immutable";
import { CondSubNode } from "../data/structs";

export abstract class WhereClauseBuilder extends AddCondition {
  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected abstract grammar: Grammar;

  /**
   * All of the operation asts for builders inheriting the "WhereClauseBuilder"
   */
  protected abstract ast: TSelectOperation | TUpdateOperation | TDeleteOperation | TWhereClause | List<TConditionNode>;

  where(...args: TConditionValueArgs<TWhereBuilderFn>) {
    return this.addValueCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND);
  }
  orWhere(...args: TWhereConditionValueArgs) {
    return this.addValueCond(ClauseTypeEnum.WHERE, args, OperatorEnum.OR);
  }
  whereNot(...args: TWhereConditionValueArgs) {
    return this.addValueCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND);
  }
  orWhereNot(...args: TWhereConditionValueArgs) {
    return this.addValueCond(ClauseTypeEnum.WHERE, args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereColumn(...args: TConditionColumnArgs) {
    return this.addColumnCond(ClauseTypeEnum.WHERE, args, OperatorEnum.AND);
  }
  orWhereColumn(...args: TConditionColumnArgs) {
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
  whereDate(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.DATE, column, operator, value, OperatorEnum.AND);
  }
  orWhereDate(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.DATE, column, operator, value, OperatorEnum.OR);
  }
  whereTime(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.TIME, column, operator, value, OperatorEnum.AND);
  }
  orWhereTime(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.TIME, column, operator, value, OperatorEnum.OR);
  }
  whereDay(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.DAY, column, operator, value, OperatorEnum.AND);
  }
  orWhereDay(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.DAY, column, operator, value, OperatorEnum.OR);
  }
  whereMonth(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.MONTH, column, operator, value, OperatorEnum.AND);
  }
  orWhereMonth(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.MONTH, column, operator, value, OperatorEnum.OR);
  }
  whereYear(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(ClauseTypeEnum.WHERE, DateCondType.YEAR, column, operator, value, OperatorEnum.AND);
  }
  orWhereYear(...args: TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
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
    const builder = new SubWhereBuilder(this.grammar.newInstance(), this.subQuery);
    fn.call(builder, builder);
    if (builder.getAst().size > 0) {
      return this.pushCondition(clauseType, CondSubNode({ andOr, not, ast: builder.getAst() }));
    }
    return this;
  }

  protected chain(fn: ChainFnWhere) {
    this.ast = fn(this.ast);
    return this;
  }
}
