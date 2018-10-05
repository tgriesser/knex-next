import { Grammar } from "./Grammar";
import { SelectBuilder } from "./SelectBuilder";
import { KnexConnection } from "./Connection";
import { Structs, Types, Mixins, Enums } from "./data";
import { INSERT_BUILDER } from "./data/symbols";

export interface InsertBuilder extends Mixins.ExecutionMethods {
  [INSERT_BUILDER]: true;
}

export class InsertBuilder<T = { [columnName: string]: any }> implements Types.IBuilder {
  readonly dialect: Types.Maybe<Enums.DialectEnum> = null;

  protected grammar = new Grammar();

  constructor(protected ast = Structs.insertAst) {}

  protected connection: Types.Maybe<KnexConnection> = null;

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

  protected selectBuilder() {
    return new SelectBuilder();
  }

  protected subQuery(arg: Types.SubQueryArg) {
    const builder = this.selectBuilder();
    arg.call(builder, builder);
    return builder.getAst();
  }

  protected chain(fn: Types.ChainFnInsert) {
    this.ast = fn(this.ast);
    return this;
  }
}

InsertBuilder.prototype[INSERT_BUILDER] = true;

Mixins.withExecutionMethods(InsertBuilder);
