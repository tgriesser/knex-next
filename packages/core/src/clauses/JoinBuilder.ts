import { List } from "immutable";
import { TOperator, IJoinBuilderFn, ISubQuery, TConditionNode } from "../data/types";
import { AddCondition } from "./AddCondition";

export class JoinBuilder extends AddCondition {
  constructor(protected conditions = List<TConditionNode>()) {
    super();
  }
  on(columnA: string, columnB: string): this;
  on(columnA: string, op: TOperator, columnB: string): this;
  on(columns: { [columnA: string]: string }): this;
  on(wrappedJoin: IJoinBuilderFn): this;
  on() {
    return this;
  }
  orOn(columnA: string, columnB: string): this;
  orOn(columnA: string, op: TOperator, columnB: string): this;
  orOn(wrappedJoin: IJoinBuilderFn): this;
  orOn() {
    return this;
  }
  andOn(columnA: string, columnB: string): this;
  andOn(columnA: string, op: TOperator, columnB: string): this;
  andOn(wrappedJoin: IJoinBuilderFn): this;
  andOn() {
    return this;
  }
  onIn(columnA: string, inSub: ISubQuery): this;
  onIn(columnA: string, inArr: any[]): this;
  onIn() {
    return this;
  }
  onNotIn() {
    return this;
  }
  andNotIn() {
    return this;
  }
  getConditions() {
    return this;
  }
  pushCondition() {}
}
