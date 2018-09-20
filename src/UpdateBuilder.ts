import { WhereClauseBuilder } from "./WhereClauseBuilder";
import { updateAst } from "./datatypes";
import { ChainFnUpdate } from "./types";

export class UpdateBuilder<
  T = { [columnName: string]: any }
> extends WhereClauseBuilder {
  constructor(protected ast = updateAst) {
    super();
  }
  table(tableName: string) {}
  set(values: T) {}
  protected chain(fn: ChainFnUpdate) {
    this.ast = fn(this.ast);
    return this;
  }
}
