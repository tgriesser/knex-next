import { TOperator, IJoinBuilderFn, ISubQuery } from "../data/types";

export class JoinBuilder {
  constructor() {}
  on(columnA: string, columnB: string): this;
  on(columnA: string, op: TOperator, columnB: string): this;
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
  getAst() {}
}
