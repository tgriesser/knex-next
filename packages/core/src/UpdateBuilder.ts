import { WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { updateAst, SubQueryNode } from "./data/structs";
import { ChainFnUpdate, SubQueryArg, TValueArg } from "./data/types";
import { SelectBuilder } from "./SelectBuilder";

export class UpdateBuilder<T = { [columnName: string]: TValueArg }> extends WhereClauseBuilder {
  constructor(protected ast = updateAst) {
    super();
  }
  /**
   * Specifies the table to update in the UPDATE clause
   */
  table(tableName: string) {
    return this.chain(ast => ast.set("table", tableName));
  }
  /**
   * Specifies the values to SET in the update clause
   */
  set(values: T): this;
  set(key: string, value: TValueArg): this;
  set(...args: any[]) {
    switch (args.length) {
      case 0: {
        break;
      }
      case 1: {
        if (typeof args[0] === "object" && args[0] !== null) {
          const toUpdate = args[0];
          return this.chain(ast => {
            return Object.keys(toUpdate).reduce((result, key) => {
              if (typeof toUpdate[key] !== "function") {
              }
              return result[key];
            }, ast);
          });
        }
        break;
      }
      case 2: {
        return this.chain(ast => ast.set("values", ast.values.concat({ [args[0]]: args[1] })));
      }
      default: {
        throw new TypeError(`Invalid call signature to ${this.constructor.name}, saw ${args.join(", ")}`);
      }
    }
    return this;
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
