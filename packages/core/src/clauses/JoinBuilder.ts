import { List } from "immutable";
import {
  TConditionNode,
  TInArg,
  TColumnArg,
  SubQueryArg,
  TSubQueryNode,
  SubConditionFn,
  TAndOr,
  TNot,
  TJoinConditionValueArgs,
  TJoinConditionColumnArgs,
} from "../data/types";
import { AddCondition } from "./AddCondition";
import { ClauseTypeEnum, OperatorEnum } from "../data/enums";
import { Grammar } from "../Grammar";
import { CondSubNode } from "../data/structs";

export class JoinBuilder extends AddCondition {
  protected ast = List<TConditionNode>();
  constructor(protected grammar: Grammar, protected subQuery: ((fn: SubQueryArg) => TSubQueryNode)) {
    super();
  }
  on(...args: TJoinConditionColumnArgs) {
    return this.addColumnCond(ClauseTypeEnum.JOIN, args, OperatorEnum.AND);
  }
  orOn(...args: TJoinConditionColumnArgs) {
    return this.addColumnCond(ClauseTypeEnum.JOIN, args, OperatorEnum.OR);
  }
  onVal(...args: TJoinConditionValueArgs) {
    return this.addValueCond(ClauseTypeEnum.JOIN, args, OperatorEnum.AND);
  }
  orOnVal(...args: TJoinConditionValueArgs) {
    return this.addValueCond(ClauseTypeEnum.JOIN, args, OperatorEnum.OR);
  }
  onIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.JOIN, column, arg, OperatorEnum.AND);
  }
  onNotIn(column: TColumnArg, arg: TInArg) {
    return this.addInCond(ClauseTypeEnum.JOIN, column, arg, OperatorEnum.OR);
  }
  onNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.JOIN, column, OperatorEnum.AND);
  }
  onNotNull(column: TColumnArg) {
    return this.addNullCond(ClauseTypeEnum.JOIN, column, OperatorEnum.OR);
  }
  getAst() {
    return this.ast;
  }

  protected pushCondition(clauseType: ClauseTypeEnum.JOIN, node: TConditionNode) {
    this.ast = this.ast.push(node);
    return this;
  }

  protected subCondition(clauseType: ClauseTypeEnum.JOIN, fn: SubConditionFn, andOr: TAndOr, not: TNot) {
    const builder = new JoinBuilder(this.grammar.newInstance(), this.subQuery);
    fn.call(builder, builder);
    this.pushCondition(clauseType, CondSubNode({ andOr, not, ast: builder.getAst() }));
    return this;
  }
}

export interface JoinBuilder {
  andOn: JoinBuilder["on"];
  andOnIn: JoinBuilder["onIn"];
  andOnNotIn: JoinBuilder["onNotIn"];
}
