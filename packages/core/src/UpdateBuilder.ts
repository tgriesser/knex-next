import { List } from "immutable";
import { WhereClauseBuilder, SubWhereBuilder } from "./clauses/WhereClauseBuilder";
import { updateAst, SubQueryNode, CondSubNode } from "./data/structs";
import {
  ChainFnUpdate,
  SubQueryArg,
  TValueArg,
  TAndOr,
  TNot,
  TConditionNode,
  Maybe,
  ExecutableBuilder,
} from "./data/types";
import { SelectBuilder } from "./SelectBuilder";
import { Grammar } from "./Grammar";
import { ClauseTypeEnum } from "./data/enums";
import { NEVER } from "./data/messages";
import { IBuilder } from "./contracts/Buildable";
import { Connection } from "./Connection";

export interface UpdateBuilder extends ExecutableBuilder {}

export class UpdateBuilder<T = { [columnName: string]: TValueArg }> extends WhereClauseBuilder implements IBuilder {
  dialect = null;

  grammar = new Grammar();

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
            return ast.update("values", values => {
              values = values.asMutable();
              Object.keys(toUpdate).forEach(key => {
                const value = toUpdate[key];
                if (typeof value !== "function") {
                  return values.set(key, value);
                }
                if (typeof value === "undefined") {
                  return;
                }
                values.set(key, this.subQuery(value));
              });
              return values.asImmutable();
            });
          });
        }
        break;
      }
      case 2: {
        return this.chain(ast => ast.set("values", ast.values.set(args[0], args[1])));
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

  protected subCondition(clauseType: ClauseTypeEnum, fn: Function, andOr: TAndOr, not: TNot) {
    let builder: SubWhereBuilder | null = null;
    if (clauseType === ClauseTypeEnum.WHERE) {
      builder = new SubWhereBuilder(this.grammar.newInstance(), this.subQuery);
    }
    if (!builder) {
      throw new Error(NEVER);
    }
    fn.call(builder, builder);
    const ast = builder.getAst();
    if (ast !== List()) {
      return this.pushCondition(
        clauseType,
        CondSubNode({
          andOr,
          not,
          ast,
        })
      );
    }
    return this;
  }

  protected pushCondition(clauseType: ClauseTypeEnum, node: TConditionNode) {
    return this.chain(ast => {
      if (clauseType === ClauseTypeEnum.WHERE) {
        return ast.set("where", ast.where.push(node));
      }
      throw new Error(NEVER);
    });
  }
}
