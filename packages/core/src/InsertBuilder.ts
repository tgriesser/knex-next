import { ChainFnInsert, SubQueryArg } from "./data/types";
import { Grammar } from "./Grammar";
import { insertAst } from "./data/datatypes";
import { Loggable } from "./contracts/Loggable";

export class InsertBuilder<T = { [columnName: string]: any }>
  implements Loggable {
  public readonly dialect = null;

  protected grammar = new Grammar();

  constructor(protected ast = insertAst) {}

  values(toInsert: T | T[]) {}

  select(subQuery: SubQueryArg) {}

  inBatchesOf(value: number) {}

  insertInto(tableName: string) {
    return this.chain(ast => ast.set("table", tableName));
  }

  insertGetId() {
    return this.chain(ast => {
      return ast;
    });
  }

  getAst() {
    return this.ast;
  }

  toOperation() {
    return this.grammar.toOperation(this.ast);
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
