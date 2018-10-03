import { List } from "immutable";
import { AddCondition } from "./AddCondition";
import { Grammar } from "../Grammar";
import { Types, Enums, Structs } from "../data";

export class JoinBuilder extends AddCondition {
  protected ast = List<Types.TConditionNode>();
  constructor(protected grammar: Grammar, protected subQuery: ((fn: Types.SubQueryArg) => Types.TSubQueryNode)) {
    super();
  }
  on(...args: Types.TJoinConditionColumnArgs) {
    return this.addColumnCond(Enums.ClauseTypeEnum.JOIN, args, Enums.OperatorEnum.AND);
  }
  orOn(...args: Types.TJoinConditionColumnArgs) {
    return this.addColumnCond(Enums.ClauseTypeEnum.JOIN, args, Enums.OperatorEnum.OR);
  }
  onVal(...args: Types.TJoinConditionValueArgs) {
    return this.addValueCond(Enums.ClauseTypeEnum.JOIN, args, Enums.OperatorEnum.AND);
  }
  orOnVal(...args: Types.TJoinConditionValueArgs) {
    return this.addValueCond(Enums.ClauseTypeEnum.JOIN, args, Enums.OperatorEnum.OR);
  }
  onIn(column: Types.TColumnArg, arg: Types.TInArg) {
    return this.addInCond(Enums.ClauseTypeEnum.JOIN, column, arg, Enums.OperatorEnum.AND);
  }
  onNotIn(column: Types.TColumnArg, arg: Types.TInArg) {
    return this.addInCond(Enums.ClauseTypeEnum.JOIN, column, arg, Enums.OperatorEnum.OR);
  }
  onNull(column: Types.TColumnArg) {
    return this.addNullCond(Enums.ClauseTypeEnum.JOIN, column, Enums.OperatorEnum.AND);
  }
  onNotNull(column: Types.TColumnArg) {
    return this.addNullCond(Enums.ClauseTypeEnum.JOIN, column, Enums.OperatorEnum.OR);
  }
  getAst() {
    return this.ast;
  }

  protected pushCondition(clauseType: Enums.ClauseTypeEnum.JOIN, node: Types.TConditionNode) {
    this.ast = this.ast.push(node);
    return this;
  }

  protected subCondition(
    clauseType: Enums.ClauseTypeEnum.JOIN,
    fn: Types.SubConditionFn,
    andOr: Types.TAndOr,
    not: Types.TNot
  ) {
    const builder = new JoinBuilder(this.grammar.newInstance(), this.subQuery);
    fn.call(builder, builder);
    this.pushCondition(clauseType, Structs.CondSubNode({ andOr, not, ast: builder.getAst() }));
    return this;
  }
}

export interface JoinBuilder {
  andOn: JoinBuilder["on"];
  andOnIn: JoinBuilder["onIn"];
  andOnNotIn: JoinBuilder["onNotIn"];
}
