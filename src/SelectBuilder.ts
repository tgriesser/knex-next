import {
  selectAst,
  TRawNode,
  UnionNode,
  DialectEnum,
  Maybe,
  TSelectNode,
  ColumnNode,
  SubQueryNode,
  ISubQuery,
  TSelectOperation,
} from "./datatypes";
import { WhereClauseBuilder } from "./WhereClauseBuilder";
import {
  TSelectArg,
  TTableArg,
  TUnionArg,
  SubQuery,
  ChainFnSelect,
  ChainFn,
} from "./types";
import { Grammar } from "./Grammar";
import { isRawNode, isSelectBuilder } from "./predicates";

export class SelectBuilder extends WhereClauseBuilder {
  /**
   * Useful if we want to check the builder's dialect from userland.
   */
  public readonly dialect: Maybe<DialectEnum> = null;

  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected grammar = new Grammar();

  constructor(protected ast = selectAst) {
    super();
  }

  select(...args: Array<TSelectArg>): this {
    return this.chain(ast => {
      return ast.update("select", cols => {
        return args.reduce((result, arg) => {
          const node = this.selectArg(arg);
          return node ? result.push(node) : result;
        }, cols);
      });
    });
  }

  /**
   * A select argument can be a "string", a "function" (SubQuery),
   * an instance of a SelectBuilder, or RawNode.
   */
  protected selectArg(arg: TSelectArg): Maybe<TSelectNode> {
    if (arg === null || arg === undefined) {
      return null;
    }
    if (typeof arg === "string") {
      return ColumnNode({
        __dialect: this.dialect,
        value: arg,
        escaped: this.grammar.escapeId(arg),
      });
    }
    if (typeof arg === "function") {
      return this.subQuery(arg);
    }
    if (isSelectBuilder(arg)) {
      return this.subSelect(arg);
    }
    if (isRawNode(arg)) {
      return arg;
    }
    return null;
  }

  /**
   * Force the query to only return distinct results.
   */
  distinct(): this {
    return this.chain(ast => {
      return ast.set("distinct", true);
    });
  }

  from(table: TTableArg) {
    if (this.isEmpty(table)) {
      return this;
    }
    return this.chain(ast => {
      if (typeof table === "string") {
      }
      return ast;
    });
  }

  join() {
    return this.chain(ast => {
      return ast;
    });
  }

  joinWhere() {
    return this.chain(ast => {
      return ast;
    });
  }

  leftJoin() {
    return this.chain(ast => {
      return ast;
    });
  }

  leftJoinWhere() {
    return this.chain(ast => {
      return ast;
    });
  }

  leftJoinSub() {
    return this.chain(ast => {
      return ast;
    });
  }

  rightJoin() {
    return this.chain(ast => {
      return ast;
    });
  }

  rightJoinWhere() {
    return this.chain(ast => {
      return ast;
    });
  }

  rightJoinSub() {
    return this.chain(ast => {
      return ast;
    });
  }

  crossJoin() {
    return this.chain(ast => {
      return ast;
    });
  }

  groupBy() {
    return this.chain(ast => {
      return ast;
    });
  }

  orderBy() {
    return this.chain(ast => {
      return ast;
    });
  }

  orderByDesc() {
    return this.chain(ast => {
      return ast;
    });
  }

  /**
   * Set the "offset" value of the query.
   */
  offset(value: number | TRawNode) {
    return this.chain(ast => {
      return ast;
    });
  }

  /**
   * Set the "limit" value of the query.
   */
  limit(value: number | TRawNode) {
    return this.chain(ast => {
      return ast;
    });
  }

  union(...args: Array<TUnionArg>) {
    return this.addUnionClauses(args);
  }

  unionAll(...args: Array<TUnionArg>) {
    return this.addUnionClauses(args, true);
  }

  protected addUnionClauses(args: Array<TUnionArg>, unionAll: boolean = false) {
    return this.chain(ast => {
      return args.reduce((result, arg) => {
        if (typeof arg === "function") {
          return result.update("union", unions =>
            unions.push(
              UnionNode({
                value: new (this
                  .constructor as typeof SelectBuilder)().getAst(),
              })
            )
          );
        }
        return result;
      }, ast);
    });
  }

  lock(value: boolean | string = true) {
    return this.chain(ast => {
      return ast;
    });
  }

  lockForUpdate() {
    return this.lock(true);
  }

  sharedLock() {
    return this.lock(false);
  }

  find() {
    return this.chain(ast => {
      return ast;
    });
  }

  value() {
    return this.chain(ast => {
      return ast;
    });
  }

  pluck() {
    return this.chain(ast => {
      return ast;
    });
  }

  exists() {
    return this.chain(ast => {
      return ast;
    });
  }

  doesntExist() {
    return this.chain(ast => {
      return ast;
    });
  }

  count() {
    return this.chain(ast => {
      return ast;
    });
  }

  min() {
    return this.chain(ast => {
      return ast;
    });
  }

  max() {
    return this.chain(ast => {
      return ast;
    });
  }

  sum() {
    return this.chain(ast => {
      return ast;
    });
  }

  avg() {
    return this.chain(ast => {
      return ast;
    });
  }

  average() {
    return this.chain(ast => {
      return ast;
    });
  }

  aggregate() {
    return this.chain(ast => {
      return ast;
    });
  }

  numericAggregate() {
    return this.chain(ast => {
      return ast;
    });
  }

  delete() {
    return this.chain(ast => {
      return ast;
    });
  }

  truncate() {
    return this.chain(ast => {
      return ast;
    });
  }

  cloneWithout() {
    return this.chain(ast => {
      return ast;
    });
  }

  toString() {
    return `[${this.constructor.name}]`;
  }

  toSql() {
    return this.grammar.toSql(this.ast);
  }

  toOperation() {
    return this.grammar.toOperation(this.ast);
  }

  getAst() {
    return this.ast;
  }

  protected fromSub() {
    return this.chain(ast => {
      return ast;
    });
  }

  protected selectSub() {
    return this.chain(ast => {
      return ast;
    });
  }

  protected joinSub() {
    return this.chain(ast => {
      return ast;
    });
  }

  protected subQuery(fn: SubQuery) {
    const builder = new (<typeof SelectBuilder>this.constructor)();
    fn.call(builder, builder);
    return this.subSelect(builder);
  }

  protected subSelect(builder: SelectBuilder) {
    let subQueryData: Partial<ISubQuery> = {
      ast: builder.getAst(),
    };
    if (builder.dialect === this.dialect) {
      subQueryData = {
        ast: builder.getAst(),
        ...builder.toOperation(),
      };
    }
    return SubQueryNode(subQueryData);
  }

  protected isEmpty(val: any) {
    return val === null || val === undefined || val === "";
  }

  protected chain(fn: ChainFnSelect): this {
    this.ast = fn(this.ast);
    return this;
  }

  toImmutable() {
    const builder = new this.constructor(this.ast);
  }

  toMutable() {}
}
