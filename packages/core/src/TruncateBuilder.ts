import { Grammar } from "./Grammar";
import { IBuilder } from "./contracts/Buildable";
import { truncateAst } from "./data/structs";
import * as Types from "./data/types";
import { Connection } from "./Connection";

export interface TruncateBuilder extends Types.ExecutableBuilder {}

export class TruncateBuilder implements IBuilder {
  dialect = null;

  protected grammar = new Grammar();

  constructor(protected ast = truncateAst) {}

  protected connection: Types.Maybe<Connection> = null;

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
