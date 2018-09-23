import { ChainFnInsert, SubQueryArg } from "./data/types";
import { Grammar } from "./Grammar";
import { insertAst, TRawNode } from "./data/datatypes";
import { Loggable } from "./contracts/Loggable";
import { Buildable } from "./contracts/Buildable";
import { SelectBuilder } from "./SelectBuilder";

export class InsertBuilder<T = { [columnName: string]: any }>
  implements Loggable, Buildable {
  public readonly dialect = null;

  grammar = new Grammar();

  constructor(protected ast = insertAst) {}

  into(tableName: string) {
    return this.chain(ast => ast.set("table", tableName));
  }

  columns(...columnName: string[]) {}

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

  toOperation() {
    return this.grammar.toOperation(this.ast);
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

  log(msg: string) {
    console.log(msg);
  }

  error(err: Error) {
    console.error(err);
  }

  warn(warning: string | Error) {
    console.warn(warning);
  }
}
