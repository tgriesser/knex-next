import { Grammar } from "./Grammar";
import { Buildable } from "./contracts/Buildable";
import { truncateAst } from "./data/structs";
import { ChainFnTruncate } from "@knex/core/src/data/types";

export class TruncateBuilder implements Buildable {
  grammar = new Grammar();

  constructor(protected ast = truncateAst) {}

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
