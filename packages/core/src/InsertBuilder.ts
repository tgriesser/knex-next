import { Grammar } from "./Grammar";
import { IBuilder } from "./contracts/Buildable";
import { SelectBuilder } from "./SelectBuilder";
import { Connection } from "./Connection";
import { Structs, Types, Mixins } from "./data";

export interface InsertBuilder extends Types.ExecutableBuilder {}

export class InsertBuilder<T = { [columnName: string]: any }> implements IBuilder {
  public readonly dialect = null;

  protected grammar = new Grammar();

  constructor(protected ast = Structs.insertAst) {}

  protected connection: Types.Maybe<Connection> = null;

  clearValues() {
    return this.chain(ast => ast.set("values", Structs.insertAst.values));
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

  select(arg: Types.SubQueryArg | Types.TRawNode) {
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

  protected subQuery(arg: Types.SubQueryArg) {
    const builder = new SelectBuilder();
    arg.call(builder, builder);
    return builder.getAst();
  }

  protected chain(fn: Types.ChainFnInsert) {
    this.ast = fn(this.ast);
    return this;
  }
}

Mixins.withExecutionMethods(InsertBuilder);
