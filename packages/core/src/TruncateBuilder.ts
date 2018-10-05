import { Grammar } from "./Grammar";
import { truncateAst } from "./data/structs";
import * as Types from "./data/types";
import { KnexConnection } from "./Connection";
import { Mixins } from "./data";

export interface TruncateBuilder extends Mixins.ExecutionMethods {}

export class TruncateBuilder implements Types.IBuilder {
  dialect = null;

  protected grammar = new Grammar();

  constructor(protected ast = truncateAst) {}

  protected connection: Types.Maybe<KnexConnection> = null;

  table(tableName: string) {
    return this.chain(ast => ast.set("table", tableName));
  }

  getAst() {
    return this.ast;
  }

  protected chain(fn: Types.ChainFnTruncate) {
    this.ast = fn(this.ast);
    return this;
  }
}
