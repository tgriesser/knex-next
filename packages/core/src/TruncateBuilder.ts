import { Grammar } from "./Grammar";
import { IBuilder } from "./contracts/Buildable";
import { truncateAst } from "./data/structs";
import { ChainFnTruncate, Maybe, ExecutableBuilder } from "./data/types";
import { Connection } from "./Connection";

export interface TruncateBuilder extends ExecutableBuilder {}

export class TruncateBuilder implements IBuilder {
  dialect = null;

  protected grammar = new Grammar();

  constructor(protected ast = truncateAst) {}

  protected connection: Maybe<Connection> = null;

  table(tableName: string) {
    return this.chain(ast => ast.set("table", tableName));
  }

  getAst() {
    return this.ast;
  }

  protected chain(fn: ChainFnTruncate) {
    this.ast = fn(this.ast);
    return this;
  }
}
