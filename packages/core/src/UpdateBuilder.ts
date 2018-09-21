import { WhereClauseBuilder } from "./WhereClauseBuilder";
import { updateAst } from "./data/datatypes";
import { ChainFnUpdate } from "./data/types";

export class UpdateBuilder<
  T = { [columnName: string]: any }
> extends WhereClauseBuilder {
  constructor(protected ast = updateAst) {
    super();
  }
  table(tableName: string) {}
  set(values: T) {}
  getAst() {
    return this.ast;
  }
  protected chain(fn: ChainFnUpdate) {
    this.ast = fn(this.ast);
    return this;
  }
}
