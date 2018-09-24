import { WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { updateAst, SubQueryNode } from "./data/structs";
import { ChainFnUpdate, SubQueryArg } from "./data/types";
import { SelectBuilder } from "./SelectBuilder";

export class UpdateBuilder<T = { [columnName: string]: any }> extends WhereClauseBuilder {
  constructor(protected ast = updateAst) {
    super();
  }
  /**
   * Specifies the table to update in the UPDATE clause
   */
  table(tableName: string) {}
  /**
   * Specifies the values to SET in the update clause
   */
  set(values: T) {
    //
  }
  /**
   * Returns the current AST of the update builder
   */
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
