import { DialectEnum, OperatorEnum, ClauseTypeEnum } from "../data/enums";
import {
  ChainFnHaving,
  Maybe,
  SubQueryArg,
  TAndOr,
  TColumnArg,
  TNot,
  TSubQueryNode,
  TConditionNode,
  TInArg,
  TConditionColumnArgs,
  TBetweenArg,
  THavingConditionValueArgs,
} from "../data/types";
import { Grammar } from "../Grammar";
import { AddCondition } from "./AddCondition";
import { List } from "immutable";
import { CondSubNode } from "../data/structs";

/**
 * The advanced HAVING builder. Since HAVING clauses aren't as common,
 * this is only accessed by passing a function to the having method off the
 * SelectBuilder.
 */
export abstract class HavingClauseBuilder extends AddCondition {
  /**
   * Useful if we want to check the builder's dialect from userland.
   */
  public readonly dialect: Maybe<DialectEnum> = null;

  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected grammar = new Grammar();

  protected abstract ast: List<TConditionNode>;

  having(...args: THavingConditionValueArgs) {
    return this.addValueCond(ClauseTypeEnum.HAVING, args, OperatorEnum.AND);
  }
  orHaving(...args: THavingConditionValueArgs) {
    return this.addValueCond(ClauseTypeEnum.HAVING, args, OperatorEnum.OR);
  }
  havingColumn(...args: TConditionColumnArgs) {
    return this.addColumnCond(ClauseTypeEnum.HAVING, args, OperatorEnum.AND);
  }
  orHavingColumn(...args: TConditionColumnArgs) {
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
  havingBetween(column: TColumnArg, arg: TBetweenArg) {
    return this.addBetweenCond(ClauseTypeEnum.HAVING, column, arg, OperatorEnum.AND);
  }
  orHavingBetween(column: TColumnArg, arg: TBetweenArg) {
    return this.addBetweenCond(ClauseTypeEnum.HAVING, column, arg, OperatorEnum.OR);
  }
  havingNotBetween(column: TColumnArg, arg: TBetweenArg) {
    return this.addBetweenCond(ClauseTypeEnum.HAVING, column, arg, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orHavingNotBetween(column: TColumnArg, arg: TBetweenArg) {
    return this.addBetweenCond(ClauseTypeEnum.HAVING, column, arg, OperatorEnum.OR, OperatorEnum.NOT);
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
  andHavingBetween: HavingClauseBuilder["havingBetween"];
  andHavingNotBetween: HavingClauseBuilder["havingNotBetween"];
  andHavingExists: HavingClauseBuilder["havingExists"];
  andHavingNotExists: HavingClauseBuilder["havingNotExists"];
}

HavingClauseBuilder.prototype.andHaving = HavingClauseBuilder.prototype.having;
HavingClauseBuilder.prototype.andHavingColumn = HavingClauseBuilder.prototype.havingColumn;
HavingClauseBuilder.prototype.andHavingIn = HavingClauseBuilder.prototype.havingIn;
HavingClauseBuilder.prototype.andHavingNotIn = HavingClauseBuilder.prototype.havingNotIn;
HavingClauseBuilder.prototype.andHavingNull = HavingClauseBuilder.prototype.havingNull;
HavingClauseBuilder.prototype.andHavingNotNull = HavingClauseBuilder.prototype.havingNotNull;
HavingClauseBuilder.prototype.andHavingBetween = HavingClauseBuilder.prototype.havingBetween;
HavingClauseBuilder.prototype.andHavingNotBetween = HavingClauseBuilder.prototype.havingNotBetween;
HavingClauseBuilder.prototype.andHavingExists = HavingClauseBuilder.prototype.havingExists;
HavingClauseBuilder.prototype.andHavingNotExists = HavingClauseBuilder.prototype.havingNotExists;

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
    const builder = new SubHavingBuilder(this.grammar.newInstance(), this.subQuery);
    fn.call(builder, builder);
    if (builder.getAst().size > 0) {
      return this.pushCondition(clauseType, CondSubNode({ andOr, not, ast: builder.getAst() }));
    }
    return this;
  }

  protected chain(fn: ChainFnHaving) {
    this.ast = fn(this.ast);
    return this;
  }
}
