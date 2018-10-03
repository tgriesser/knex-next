import { Grammar } from "../Grammar";
import { AddCondition } from "./AddCondition";
import { List } from "immutable";
import { Enums, Types, Structs } from "../data";

export abstract class WhereClauseBuilder extends AddCondition {
  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected abstract grammar: Grammar;

  /**
   * All of the operation asts for builders inheriting the "WhereClauseBuilder"
   */
  protected abstract ast:
    | Types.TSelectOperation
    | Types.TUpdateOperation
    | Types.TDeleteOperation
    | List<Types.TConditionNode>;

  where(...args: Types.TConditionValueArgs<Types.TWhereBuilderFn>) {
    return this.addValueCond(Enums.ClauseTypeEnum.WHERE, args, Enums.OperatorEnum.AND);
  }
  orWhere(...args: Types.TWhereConditionValueArgs) {
    return this.addValueCond(Enums.ClauseTypeEnum.WHERE, args, Enums.OperatorEnum.OR);
  }
  whereNot(...args: Types.TWhereConditionValueArgs) {
    return this.addValueCond(Enums.ClauseTypeEnum.WHERE, args, Enums.OperatorEnum.AND);
  }
  orWhereNot(...args: Types.TWhereConditionValueArgs) {
    return this.addValueCond(Enums.ClauseTypeEnum.WHERE, args, Enums.OperatorEnum.OR, Enums.OperatorEnum.NOT);
  }
  whereColumn(...args: Types.TConditionColumnArgs) {
    return this.addColumnCond(Enums.ClauseTypeEnum.WHERE, args, Enums.OperatorEnum.AND);
  }
  orWhereColumn(...args: Types.TConditionColumnArgs) {
    return this.addColumnCond(Enums.ClauseTypeEnum.WHERE, args, Enums.OperatorEnum.OR, Enums.OperatorEnum.NOT);
  }
  whereIn(column: Types.TColumnArg, arg: Types.TInArg) {
    return this.addInCond(Enums.ClauseTypeEnum.WHERE, column, arg, Enums.OperatorEnum.AND);
  }
  orWhereIn(column: Types.TColumnArg, arg: Types.TInArg) {
    return this.addInCond(Enums.ClauseTypeEnum.WHERE, column, arg, Enums.OperatorEnum.OR);
  }
  whereNotIn(column: Types.TColumnArg, arg: Types.TInArg) {
    return this.addInCond(Enums.ClauseTypeEnum.WHERE, column, arg, Enums.OperatorEnum.AND, Enums.OperatorEnum.NOT);
  }
  orWhereNotIn(column: Types.TColumnArg, arg: Types.TInArg) {
    return this.addInCond(Enums.ClauseTypeEnum.WHERE, column, arg, Enums.OperatorEnum.OR, Enums.OperatorEnum.NOT);
  }
  whereNull(column: Types.TColumnArg) {
    return this.addNullCond(Enums.ClauseTypeEnum.WHERE, column, Enums.OperatorEnum.AND);
  }
  orWhereNull(column: Types.TColumnArg) {
    return this.addNullCond(Enums.ClauseTypeEnum.WHERE, column, Enums.OperatorEnum.OR);
  }
  whereNotNull(column: Types.TColumnArg) {
    return this.addNullCond(Enums.ClauseTypeEnum.WHERE, column, Enums.OperatorEnum.OR, Enums.OperatorEnum.NOT);
  }
  orWhereNotNull(column: Types.TColumnArg) {
    return this.addNullCond(Enums.ClauseTypeEnum.WHERE, column, Enums.OperatorEnum.AND, Enums.OperatorEnum.NOT);
  }
  whereBetween(column: Types.TColumnArg, between: [Types.TValueArg, Types.TValueArg]) {
    return this.addBetweenCond(Enums.ClauseTypeEnum.WHERE, column, between, Enums.OperatorEnum.AND);
  }
  orWhereBetween(column: Types.TColumnArg, between: [Types.TValueArg, Types.TValueArg]) {
    return this.addBetweenCond(Enums.ClauseTypeEnum.WHERE, column, between, Enums.OperatorEnum.OR);
  }
  whereNotBetween(column: Types.TColumnArg, between: [Types.TValueArg, Types.TValueArg]) {
    return this.addBetweenCond(
      Enums.ClauseTypeEnum.WHERE,
      column,
      between,
      Enums.OperatorEnum.AND,
      Enums.OperatorEnum.NOT
    );
  }
  orWhereNotBetween(column: Types.TColumnArg, between: [Types.TValueArg, Types.TValueArg]) {
    return this.addBetweenCond(
      Enums.ClauseTypeEnum.WHERE,
      column,
      between,
      Enums.OperatorEnum.OR,
      Enums.OperatorEnum.NOT
    );
  }
  whereExists(query: Types.TQueryArg) {
    return this.addExistsCond(Enums.ClauseTypeEnum.WHERE, query, Enums.OperatorEnum.AND);
  }
  orWhereExists(query: Types.TQueryArg) {
    return this.addExistsCond(Enums.ClauseTypeEnum.WHERE, query, Enums.OperatorEnum.AND);
  }
  whereNotExists(query: Types.TQueryArg) {
    return this.addExistsCond(Enums.ClauseTypeEnum.WHERE, query, Enums.OperatorEnum.AND, Enums.OperatorEnum.NOT);
  }
  orWhereNotExists(query: Types.TQueryArg) {
    return this.addExistsCond(Enums.ClauseTypeEnum.WHERE, query, Enums.OperatorEnum.AND, Enums.OperatorEnum.NOT);
  }

  /**
   * Date Helpers:
   */
  whereDate(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.DATE,
      column,
      operator,
      value,
      Enums.OperatorEnum.AND
    );
  }
  orWhereDate(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.DATE,
      column,
      operator,
      value,
      Enums.OperatorEnum.OR
    );
  }
  whereTime(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.TIME,
      column,
      operator,
      value,
      Enums.OperatorEnum.AND
    );
  }
  orWhereTime(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.TIME,
      column,
      operator,
      value,
      Enums.OperatorEnum.OR
    );
  }
  whereDay(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.DAY,
      column,
      operator,
      value,
      Enums.OperatorEnum.AND
    );
  }
  orWhereDay(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.DAY,
      column,
      operator,
      value,
      Enums.OperatorEnum.OR
    );
  }
  whereMonth(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.MONTH,
      column,
      operator,
      value,
      Enums.OperatorEnum.AND
    );
  }
  orWhereMonth(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.MONTH,
      column,
      operator,
      value,
      Enums.OperatorEnum.OR
    );
  }
  whereYear(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.YEAR,
      column,
      operator,
      value,
      Enums.OperatorEnum.AND
    );
  }
  orWhereYear(...args: Types.TValueCondition) {
    const [column, operator, value] = this.normalizeExprArgs(args);
    return this.addDateCond(
      Enums.ClauseTypeEnum.WHERE,
      Enums.DateCondType.YEAR,
      column,
      operator,
      value,
      Enums.OperatorEnum.OR
    );
  }

  abstract getAst(): WhereClauseBuilder["ast"];

  protected abstract chain(fn: Types.ChainFnWhere): this;

  protected abstract subQuery(fn: Types.SubQueryArg): Types.TSubQueryNode;
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
  protected ast = List<Types.TConditionNode>();

  constructor(protected grammar: Grammar, protected subQuery: ((fn: Types.SubQueryArg) => Types.TSubQueryNode)) {
    super();
  }

  getAst() {
    return this.ast;
  }

  protected pushCondition(clauseType: Enums.ClauseTypeEnum.WHERE, node: Types.TConditionNode) {
    this.ast = this.ast.push(node);
    return this;
  }

  protected subCondition(
    clauseType: Enums.ClauseTypeEnum.WHERE,
    fn: Function,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    const builder = new SubWhereBuilder(this.grammar.newInstance(), this.subQuery);
    fn.call(builder, builder);
    if (builder.getAst().size > 0) {
      return this.pushCondition(clauseType, Structs.CondSubNode({ andOr, not, ast: builder.getAst() }));
    }
    return this;
  }

  protected chain(fn: Types.ChainFnWhere) {
    this.ast = fn(this.ast);
    return this;
  }
}
