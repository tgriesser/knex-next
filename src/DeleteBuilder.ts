import { WhereClauseBuilder } from "./WhereClauseBuilder";
import { ChainFnDelete } from "./types";
import { deleteAst } from "./datatypes";

export class DeleteBuilder extends WhereClauseBuilder {
  constructor(protected ast = deleteAst) {
    super();
  }
  getAst() {
    return this.ast;
  }
  protected chain(fn: ChainFnDelete) {
    this.ast = fn(this.ast);
    return this;
  }
}
