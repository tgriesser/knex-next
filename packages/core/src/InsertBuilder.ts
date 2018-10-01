import { ChainFnInsert, SubQueryArg, TRawNode, Maybe, ExecutableBuilder } from "./data/types";
import { Grammar } from "./Grammar";
import { insertAst } from "./data/structs";
import { IBuilder } from "./contracts/Buildable";
import { SelectBuilder } from "./SelectBuilder";
import { Connection } from "./Connection";

export interface InsertBuilder extends ExecutableBuilder {}

export class InsertBuilder<T = { [columnName: string]: any }> implements IBuilder {
  public readonly dialect = null;

  protected grammar = new Grammar();

  constructor(protected ast = insertAst) {}

  protected connection: Maybe<Connection> = null;

  clearValues() {
    return this.chain(ast => ast.set("values", insertAst.values));
  }

  into(tableName: string) {
    return this.chain(ast => ast.set("table", tableName));
  }

  columns(...columnName: string[]) {
    return this.chain(ast => ast.set("columns", ast.columns.concat(columnName)));
  }

  values(toInsert: T | T[]) {
    return this.chain(ast => ast.set("values", ast.values.concat(toInsert)));
  }

  select(arg: SubQueryArg | TRawNode) {
    if (typeof arg === "function") {
      return this.chain(ast => ast.set("select", this.subQuery(arg)));
    }
    return this;
  }

  inBatchesOf(value: number) {
    return this.chain(ast => ast.set("chunkSize", value));
  }

  getAst() {
    return this.ast;
  }

  protected subQuery(arg: SubQueryArg) {
    const builder = new SelectBuilder();
    arg.call(builder, builder);
    return builder.getAst();
  }

  protected chain(fn: ChainFnInsert) {
    this.ast = fn(this.ast);
    return this;
  }
}
