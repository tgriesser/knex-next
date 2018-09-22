import { WhereClauseBuilder } from "./WhereClauseBuilder";
import { updateAst, SubQueryNode } from "./data/datatypes";
import { ChainFnUpdate, SubQueryArg } from "./data/types";
import { SelectBuilder } from "@knex/core/src/SelectBuilder";

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
  protected subQuery(fn: SubQueryArg) {
    const builder = new SelectBuilder();
    fn.call(builder, builder);
    return SubQueryNode({ ast: builder.getAst() });
  }
}
