import dedent from "dedent";
import invariant from "invariant";
import { List } from "immutable";
import { SubHavingBuilder } from "./clauses/HavingClauseBuilder";
import { JoinBuilder } from "./clauses/JoinBuilder";
import { SubWhereBuilder, WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { KnexConnection } from "./Connection";
import { NEVER } from "./data/messages";
import { isRawNode, isSelectBuilder, isNodeOf } from "./data/predicates";
import { SELECT_BUILDER } from "./data/symbols";
import { ExecutionContext } from "./ExecutionContext";
import { Grammar } from "./Grammar";
import { Types, Structs, Enums, Mixins, Messages } from "./data";
import { SubQueryNode } from "./data/structs";

// Only used as types, and only here for backward compat:
import { InsertBuilder } from "./InsertBuilder";
import { UpdateBuilder } from "./UpdateBuilder";
import { DeleteBuilder } from "./DeleteBuilder";

export interface SelectBuilder<T = any> extends Mixins.EventEmitterMixin {}

export class SelectBuilder<T = any> extends WhereClauseBuilder implements Types.IBuilder {
  /**
   * Whether the builder is "mutable". Immutable builders are useful
   * when building subQueries or statements we want to ensure aren't
   * changed, but aren't good if we want to actually use them to
   * execute queries.
   */
  protected mutable = true;

  /**
   * Useful if we want to check the builder's dialect from userland.
   */
  public readonly dialect: Types.Maybe<Enums.DialectEnum> = null;

  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected grammar = new Grammar();

  protected connection: Types.Maybe<KnexConnection> = null;

  /**
   * All events, row iteration, and query execution takes place in
   * an "Execution Context", a combination of:
   * Connection + Grammar + EventEmitter
   */
  protected executionContext: Types.Maybe<ExecutionContext> = null;

  constructor(protected ast = Structs.selectAst, protected forSubQuery = false) {
    super();
  }

  /**
   * Select builder used in subqueries or clone, etc.
   */
  protected selectBuilder = (ast = Structs.selectAst, forSubQuery = false) =>
    new (<typeof SelectBuilder>this.constructor)(ast, forSubQuery);

  /**
   * "Clones" the current query builder, creating a new instance with a copy of
   * the Query's AST. This does not copy over properties about the query execution,
   * such as the connection or the promise state.
   */
  clone(): this {
    return this.selectBuilder(this.ast) as this;
  }

  /**
   * Columns we wish to include, optionally qualified (dot separated) by
   * the table name:
   *
   * .select('account.id')
   */
  select(...args: Types.TSelectArg[]): this {
    return this.chain(ast => {
      return ast.set(
        "select",
        args.reduce((result, arg) => {
          const node = this.selectArg(arg);
          return node ? result.push(node) : result;
        }, ast.select)
      );
    });
  }

  /**
   * Force the query to only return distinct results.
   *
   * select('id', 'name').distinct()...
   *
   * SELECT DISTINCT id, name FROM ...
   */
  distinct(): this {
    return this.chain(ast => ast.set("distinct", true));
  }

  /**
   * Adds the FROM value for the select query
   */
  from(table: Types.TTableArg) {
    if (this.isEmpty(table)) {
      return this;
    }
    return this.chain(ast => ast.set("from", this.unwrapIdent(table)));
  }

  /**
   * Adds a JOIN clause to the query
   */
  join(raw: Types.TRawNode): this;
  join(table: Types.TTableArg, aliasObj: Types.TAliasObj): this;
  join(table: Types.TTableArg, leftCol: string, rightCol: string): this;
  join(table: Types.TTableArg, leftCol: string, op: Types.TOperatorArg, rightCol: string): this;
  join(table: Types.TTableArg, subJoin: Types.TJoinBuilderFn): this;
  join(table: Types.TTableArg, ...args: any[]) {
    // Allow .join(raw`...`) for simplicity.
    if (args.length === 1 && isRawNode(args[0])) {
      return this.joinRaw(args[0]);
    }
    return this.addJoinClause(Enums.JoinTypeEnum.INNER, table, args);
  }
  joinVal(table: Types.TTableArg, ...args: any[]) {
    return this.addJoinClause(Enums.JoinTypeEnum.INNER, table, args, true);
  }
  leftJoin(table: Types.TTableArg, ...args: any[]) {
    return this.addJoinClause(Enums.JoinTypeEnum.LEFT, table, args);
  }
  leftJoinVal(table: Types.TTableArg, ...args: any[]) {
    return this.addJoinClause(Enums.JoinTypeEnum.LEFT, table, args, true);
  }
  rightJoin(table: Types.TTableArg, ...args: any[]) {
    return this.addJoinClause(Enums.JoinTypeEnum.RIGHT, table, args);
  }
  rightJoinVal(table: Types.TTableArg, ...args: any[]) {
    return this.addJoinClause(Enums.JoinTypeEnum.RIGHT, table, args, true);
  }
  leftOuterJoin(table: Types.TTableArg, ...args: any[]) {
    return this.addJoinClause(Enums.JoinTypeEnum.LEFT_OUTER, table, args);
  }
  rightOuterJoin(table: Types.TTableArg, ...args: any[]) {
    return this.addJoinClause(Enums.JoinTypeEnum.RIGHT_OUTER, table, args);
  }
  fullOuterJoin(table: Types.TTableArg, ...args: any[]) {
    return this.addJoinClause(Enums.JoinTypeEnum.FULL_OUTER, table, args);
  }
  crossJoin(table: Types.TTableArg, ...args: any[]) {
    return this.addJoinClause(Enums.JoinTypeEnum.CROSS, table, args);
  }

  joinRaw(node: Types.TRawNode) {
    invariant(
      isRawNode(node),
      "Expected joinRaw to be provided with a knex raw`` template tag literal, instead saw %s",
      typeof node
    );
    return this.chain(ast => ast.set("join", ast.join.push(node)));
  }

  /**
   * Adds a GROUP BY ... clause to the query
   */
  groupBy(...args: Types.TGroupByArg[]) {
    if (arguments.length === 0) {
      return this;
    }
    return this.chain(ast => ast.set("group", ast.group.concat(args)));
  }

  /**
   * Adds a HAVING clause to the query, for more advanced HAVING clauses,
   * make the first parameter a function and you'll get the advanced
   * having clause builder.
   */
  having(...args: Types.THavingConditionValueArgs) {
    return this.addValueCond(Enums.ClauseTypeEnum.HAVING, args, Enums.OperatorEnum.AND);
  }

  /**
   * Adds an ORDER BY clause to the query
   *
   * .orderBy('something', 'asc').orderBy('somethingElse', 'desc')
   */
  orderBy(column: Types.TColumnArg, direction: Types.TOrderByDirection = "asc") {
    if (arguments.length === 0 || column === null || column === undefined) {
      return this;
    }
    return this.chain(ast =>
      ast.set(
        "order",
        ast.order.push(
          Structs.OrderByNode({
            column: this.unwrapIdent(column),
            direction: direction.toUpperCase() as Enums.OrderByEnum,
          })
        )
      )
    );
  }

  /**
   * Shorthand for orderBy(column, "desc")
   */
  orderByDesc(column: Types.TColumnArg) {
    return this.orderBy(column, "desc");
  }

  /**
   * Set the "offset" value of the query.
   */
  offset(value: number | Types.TRawNode) {
    return this.chain(ast => ast.set("offset", value));
  }

  /**
   * Set the "limit" value of the query.
   */
  limit(value: number | Types.TRawNode) {
    return this.chain(ast => ast.set("limit", value));
  }

  /**
   * Add a UNION clause to the query
   */
  union(...args: Array<Types.TUnionArg>) {
    return this.addUnionClauses(args);
  }

  /**
   * Add a UNION ALL clause to the query
   */
  unionAll(...args: Array<Types.TUnionArg>) {
    return this.addUnionClauses(args, true);
  }

  lock(value: boolean | string = true) {
    return this.chain(ast => ast.set("lock", value));
  }

  lockForUpdate() {
    return this.lock(true);
  }

  sharedLock() {
    return this.lock(false);
  }

  count(column: Types.TAggregateArg) {
    return this.addAggregate(Enums.AggregateFns.COUNT, column);
  }
  countDistinct(column: Types.TAggregateArg) {
    return this.addAggregate(Enums.AggregateFns.COUNT, column, true);
  }
  min(column: Types.TAggregateArg) {
    return this.addAggregate(Enums.AggregateFns.MIN, column);
  }
  max(column: Types.TAggregateArg) {
    return this.addAggregate(Enums.AggregateFns.MAX, column);
  }
  sum(column: Types.TAggregateArg) {
    return this.addAggregate(Enums.AggregateFns.SUM, column);
  }
  sumDistinct(column: Types.TAggregateArg) {
    return this.addAggregate(Enums.AggregateFns.SUM, column, true);
  }
  avg(column: Types.TAggregateArg) {
    return this.addAggregate(Enums.AggregateFns.AVG, column);
  }
  avgDistinct(column: Types.TAggregateArg) {
    return this.addAggregate(Enums.AggregateFns.AVG, column, true);
  }

  as(val: string) {
    return this.chain(ast => ast.set("alias", val));
  }

  toString() {
    return `[${this.constructor.name}]`;
  }

  toSql() {
    return this.grammar.toSql(this.ast);
  }

  fromJS(obj: Types.FromJSArg) {
    return this;
  }

  getAst(): Types.TSelectOperation {
    return this.ast;
  }

  toImmutable() {
    if (this.executionContext) {
      throw new Error(Messages.IMMUTABLE_CONVERSION);
    }
    const builder = this.clone();
    builder.mutable = false;
    return builder;
  }

  toMutable() {
    if (this.mutable) {
      return this;
    }
    const builder = this.clone();
    builder.mutable = true;
    return builder;
  }

  protected insertBuilder(): InsertBuilder {
    throw new Error("Abstract, implemented in inheriting classes.");
  }
  protected updateBuilder(): UpdateBuilder {
    throw new Error("Abstract, implemented in inheriting classes.");
  }
  protected deleteBuilder(): DeleteBuilder {
    throw new Error("Abstract, implemented in inheriting classes.");
  }

  /**
   * Add the update/insert/delete APIs in, even though they're deprecated. We've changed
   * the types on the signatures so anyone using TypeScript will see errors for these changes...
   * otherwise we'll just warn at execution time.
   */
  insert(...args: any[]) {
    this.warn(
      new Error(dedent`
      The .insert() method should should no longer be chained off of a select query.
      Check the docs for how to migrate to the new APIs.
    `)
    );
    const builder = this.insertBuilder();
    if (this.connection) {
      builder.setConnection(this.connection);
    }
    // @ts-ignore
    return builder.values(...args);
  }

  update(...args: any[]) {
    this.warn(
      new Error(dedent`
      The .update() method should should no longer be chained off of a select query.
      Check the docs for how to migrate to the new APIs.
    `)
    );
    const builder = this.updateBuilder();
    if (this.connection) {
      builder.setConnection(this.connection);
    }
    // @ts-ignore
    return builder.set(...args);
  }

  del(arg: never) {
    this.warn(
      new Error(dedent`
      The .del() or .delete() method should should no longer be chained off of a select query.
      Check the docs for how to migrate to the new APIs.
    `)
    );
    const builder = this.updateBuilder();
    if (this.connection) {
      builder.setConnection(this.connection);
    }
    return builder;
  }

  delete(arg: never) {
    // @ts-ignore
    return this.del(arg);
  }

  /**
   * Clears any SELECT expressions set on the builder
   */
  clearSelect() {
    return this.chain(ast => ast.set("select", Structs.selectAst.select));
  }

  /**
   * Clears any WHERE conditions set on the builder
   */
  clearWhere() {
    return this.chain(ast => ast.set("where", Structs.selectAst.where));
  }

  /**
   * Clears any HAVING conditions set on the builder
   */
  clearHaving() {
    return this.chain(ast => ast.set("having", Structs.selectAst.having));
  }

  /**
   * Clears any UNION clauses set on the builder
   */
  clearUnion() {
    return this.chain(ast => ast.set("union", Structs.selectAst.union));
  }

  /**
   * Clears any GROUP BY set on the builder
   */
  clearGroup() {
    return this.chain(ast => ast.set("group", Structs.selectAst.group));
  }

  /**
   * Clears any GROUP BY set on the builder
   */
  clearLimit() {
    return this.chain(ast => ast.set("limit", Structs.selectAst.limit));
  }

  /**
   * Clears any GROUP BY set on the builder
   */
  clearOffset() {
    return this.chain(ast => ast.set("offset", Structs.selectAst.offset));
  }

  protected addUnionClauses(args: Array<Types.TUnionArg>, unionAll: boolean = false) {
    return this.chain(ast => {
      return ast.set(
        "union",
        args.reduce((result, arg) => {
          if (typeof arg === "function") {
            const ast = this.selectBuilder().getAst();
            return result.push(Structs.UnionNode({ ast: SubQueryNode({ ast }), all: unionAll }));
          }
          return result;
        }, ast.union)
      );
    });
  }

  /**
   * Adds a JOIN clause to the query.
   */
  protected addJoinClause(joinType: Enums.JoinTypeEnum, table: Types.TTableArg, args: any[], asVal = false): this {
    const builder = new JoinBuilder(this.grammar.newInstance(), this.subQuery);
    switch (args.length) {
      case 1: {
        if (typeof args[0] === "function") {
          args[0].call(builder, builder);
          // {table.column: table.column} syntax
        } else if (typeof args[0] === "object") {
          Object.keys(args[0]).forEach(key => {
            builder.on(key, args[0][key]);
          });
        }
        break;
      }
      case 2: {
        return this.addJoinClause(joinType, table, [args[0], "=", args[1]], asVal);
      }
      case 3: {
        if (asVal) {
          builder.onVal(args[0], args[1], args[2]);
        } else {
          builder.on(args[0], args[1], args[2]);
        }
        break;
      }
    }
    const conditions = builder.getAst();
    const joinNode = Structs.JoinNode({
      joinType,
      table: this.unwrapTable(table),
      conditions,
    });
    return this.chain(ast => ast.set("join", ast.join.push(joinNode)));
  }

  /**
   * Adds an aggregate value to the SELECT clause
   */
  protected addAggregate(fn: Enums.AggregateFns, column: Types.TAggregateArg, distinct: boolean = false) {
    const unwrappedColumn = Array.isArray(column) ? column : this.unwrapIdent(column);
    const opts: Types.Omit<Types.IAggregateNode, "__typename"> = isNodeOf(unwrappedColumn, Enums.NodeTypeEnum.ALIASED)
      ? {
          fn,
          column: unwrappedColumn.ident,
          alias: unwrappedColumn.alias,
          distinct,
        }
      : {
          fn,
          column: unwrappedColumn,
          distinct,
          alias: null,
        };
    return this.chain(ast => ast.set("select", ast.select.push(Structs.AggregateNode(opts))));
  }

  /**
   * A select argument can be a "string", a "function" (SubQuery),
   * an instance of a SelectBuilder, or RawNode.
   */
  protected selectArg(arg: Types.TSelectArg): Types.Maybe<Types.TSelectNode> {
    if (arg === null || arg === undefined) {
      return null;
    }
    if (typeof arg === "string") {
      return arg;
    }
    if (typeof arg === "function") {
      return this.subQuery(arg);
    }
    if (isSelectBuilder(arg)) {
      return Structs.SubQueryNode({ ast: arg.getAst() });
    }
    if (isRawNode(arg)) {
      return arg;
    }
    return null;
  }

  protected subCondition(clauseType: Enums.ClauseTypeEnum, fn: Function, andOr: Types.TAndOr, not: Types.TNot) {
    let builder: SubHavingBuilder | SubWhereBuilder | null = null;
    if (clauseType === Enums.ClauseTypeEnum.HAVING) {
      builder = new SubHavingBuilder(this.grammar.newInstance(), this.subQuery);
    } else if (clauseType === Enums.ClauseTypeEnum.WHERE) {
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
        Structs.CondSubNode({
          andOr,
          not,
          ast,
        })
      );
    }
    return this;
  }

  protected pushCondition(clauseType: Enums.ClauseTypeEnum, node: Types.TConditionNode) {
    return this.chain(ast => {
      if (clauseType === Enums.ClauseTypeEnum.HAVING) {
        return ast.set("having", ast.having.push(node));
      }
      if (clauseType === Enums.ClauseTypeEnum.WHERE) {
        return ast.set("where", ast.where.push(node));
      }
      throw new Error(NEVER);
    });
  }

  protected subQuery = (fn: Types.SubQueryArg) => {
    const builder = this.selectBuilder();
    fn.call(builder, builder);
    return Structs.SubQueryNode({ ast: builder.getAst() });
  };

  protected isEmpty(val: any) {
    return val === null || val === undefined || val === "";
  }

  protected chain(fn: Types.ChainFnSelect): this {
    if (this.mutable) {
      this.ast = fn(this.ast);
      return this;
    }
    return new (<typeof SelectBuilder>this.constructor)(fn(this.ast)) as this;
  }

  /**
   * Takes an argument in a "table" slot and unwraps it so any subqueries / raw values are
   * properly handled.
   */
  protected unwrapTable(column: Types.TTableArg): Types.TTable {
    if (typeof column === "function") {
      return this.subQuery(column);
    }
    if (typeof column === "string" || typeof column === "number") {
      return column;
    }
    if (isRawNode(column)) {
      return column;
    }
    if (isSelectBuilder(column)) {
      return Structs.SubQueryNode({ ast: column.getAst() });
    }
    console.log(column);
    throw new Error(`Invalid column type provided to the query builder: ${typeof column}`);
  }
}

export interface SelectBuilder<T = any> extends Mixins.ExecutionMethods<T> {
  [SELECT_BUILDER]: true;
}

SelectBuilder.prototype[SELECT_BUILDER] = true;

Mixins.withExecutionMethods(SelectBuilder);
