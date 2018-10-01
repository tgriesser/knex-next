import { List } from "immutable";
import {
  TOperatorArg,
  IJoinBuilderFn,
  TConditionNode,
  TInArg,
  TColumnArg,
  IRawNode,
  SubQueryArg,
  TSubQueryNode,
  SubConditionFn,
  TAndOr,
  TNot,
  TValueArg,
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
  on(raw: IRawNode): this;
  on(columnA: TColumnArg, columnB: TColumnArg): this;
  on(columnA: TColumnArg, op: TOperatorArg, columnB: TColumnArg): this;
  on(columns: { [columnA: string]: string }): this;
  on(wrappedJoin: IJoinBuilderFn): this;
  on(...args: any[]) {
    return this.addColumnCond(ClauseTypeEnum.JOIN, args, OperatorEnum.AND);
  }
  onVal(columnA: TColumnArg, columnB: TValueArg): this;
  onVal(columnA: TColumnArg, op: TOperatorArg, columnB: TValueArg): this;
  onVal(...args: any[]) {
    return this.addCond(ClauseTypeEnum.JOIN, args, OperatorEnum.AND);
  }
  orOn(raw: IRawNode): this;
  orOn(columnA: TColumnArg, columnB: TColumnArg): this;
  orOn(columnA: TColumnArg, op: TOperatorArg, columnB: TColumnArg): this;
  orOn(wrappedJoin: IJoinBuilderFn): this;
  orOn(...args: any[]) {
    return this.addColumnCond(ClauseTypeEnum.JOIN, args, OperatorEnum.OR);
  }
  orOnVal(columnA: TColumnArg, columnB: TValueArg): this;
  orOnVal(columnA: TColumnArg, op: TOperatorArg, columnB: TValueArg): this;
  orOnVal(...args: any[]) {
    return this.addCond(ClauseTypeEnum.JOIN, args, OperatorEnum.OR);
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
