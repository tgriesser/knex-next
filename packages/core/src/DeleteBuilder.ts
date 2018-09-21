import { WhereClauseBuilder } from "./WhereClauseBuilder";
import { ChainFnDelete, SubQueryArg } from "./data/types";
import { deleteAst, SubQueryNode } from "./data/datatypes";
import { SelectBuilder } from "./SelectBuilder";

export class DeleteBuilder extends WhereClauseBuilder {
  constructor(protected ast = deleteAst) {
    super();
  }

  getAst() {
    return this.ast;
  }

  subQuery(fn: SubQueryArg) {
    const builder = new SelectBuilder();
    fn.call(builder, builder);
    return new SubQueryNode({ ast: builder.getAst() });
  }

  protected chain(fn: ChainFnDelete) {
    this.ast = fn(this.ast);
    return this;
  }
}
