import { WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { ChainFnDelete, SubQueryArg } from "./data/types";
import { deleteAst, SubQueryNode } from "./data/datatypes";
import { SelectBuilder } from "./SelectBuilder";

export class DeleteBuilder extends WhereClauseBuilder {
  constructor(protected ast = deleteAst) {
    super();
  }

  from(tableName: string) {
    return this.chain(ast => ast.set("table", tableName));
  }

  getAst() {
    return this.ast;
  }

  subQuery(fn: SubQueryArg) {
    const builder = new SelectBuilder();
    fn.call(builder, builder);
    return new SubQueryNode({ ast: builder.getAst() });
  }

  toOperation() {
    return this.grammar.toOperation(this.ast);
  }

  protected chain(fn: ChainFnDelete) {
    this.ast = fn(this.ast);
    return this;
  }
}
