import { TOperationAst } from "./data/datatypes";

let cid = 0;

export class KnexConnection {
  cid = cid + 1;

  constructor() {}

  execute(op: TOperationAst) {
    return this;
  }

  asPromise() {}

  toString() {
    return `[KnexConnection ${this.cid}]`;
  }
}
