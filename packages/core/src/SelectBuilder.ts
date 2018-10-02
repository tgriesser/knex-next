import dedent from "dedent";
import invariant from "invariant";
import { List } from "immutable";
import { SubHavingBuilder } from "./clauses/HavingClauseBuilder";
import { JoinBuilder } from "./clauses/JoinBuilder";
import { SubWhereBuilder, WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { Connection } from "./Connection";
import {
  AggregateFns,
  ClauseTypeEnum,
  DialectEnum,
  JoinTypeEnum,
  NodeTypeEnum,
  OrderByEnum,
  OperatorEnum,
} from "./data/enums";
import { NEVER } from "./data/messages";
import { isRawNode, isSelectBuilder, isNodeOf } from "./data/predicates";
import { AggregateNode, CondSubNode, JoinNode, selectAst, SubQueryNode, UnionNode, OrderByNode } from "./data/structs";
import { SELECT_BUILDER } from "./data/symbols";
import {
  ChainFnSelect,
  FromJSArg,
  TJoinBuilderFn,
  Maybe,
  SubQueryArg,
  TAndOr,
  TColumnArg,
  TConditionNode,
  TGroupByArg,
  TNot,
  TOrderByDirection,
  TRawNode,
  TSelectArg,
  TSelectNode,
  TSelectOperation,
  TTable,
  TTableArg,
  TUnionArg,
  TAggregateArg,
  IAggregateNode,
  Omit,
  TAliasObj,
  TOperatorArg,
  ExecutableBuilder,
  THavingConditionValueArgs,
} from "./data/types";
import { ExecutionContext } from "./ExecutionContext";
import { Grammar } from "./Grammar";
import { withEventEmitter } from "./mixins/withEventEmitter";
import { IBuilder } from "./contracts/Buildable";
import { withExecutionMethods } from "@knex/core/src/mixins/withExecutionMethods";

export class SelectBuilder<T = any> extends WhereClauseBuilder implements IBuilder {
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
  public readonly dialect: Maybe<DialectEnum> = null;

  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected grammar = new Grammar();

  protected connection: Maybe<Connection> = null;

  /**
   * All events, row iteration, and query execution takes place in
   * an "Execution Context", a combination of:
   * Connection + Grammar + EventEmitter
   */
  protected executionContext: Maybe<ExecutionContext> = null;

  constructor(protected ast = selectAst, protected forSubQuery = false) {
    super();
  }

  /**
   * Select builder used in subqueries or clone, etc.
   */
  protected selectBuilder = (ast = selectAst, forSubQuery = false) =>
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
  select(...args: TSelectArg[]): this {
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
  from(table: TTableArg) {
    if (this.isEmpty(table)) {
      return this;
    }
    return this.chain(ast => {
      if (typeof table === "string") {
        return ast.set("from", table);
      }
      return ast;
    });
  }

  /**
   * Adds a JOIN clause to the query
   */
  join(raw: TRawNode): this;
  join(table: TTableArg, aliasObj: TAliasObj): this;
  join(table: TTableArg, leftCol: string, rightCol: string): this;
  join(table: TTableArg, leftCol: string, op: TOperatorArg, rightCol: string): this;
  join(table: TTableArg, subJoin: TJoinBuilderFn): this;
  join(table: TTableArg, ...args: any[]) {
    // Allow .join(raw`...`) for simplicity.
    if (args.length === 1 && isRawNode(args[0])) {
      return this.joinRaw(args[0]);
    }
    return this.addJoinClause(JoinTypeEnum.INNER, table, args);
  }
  joinVal(table: TTableArg, ...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.INNER, table, args, true);
  }
  leftJoin(table: TTableArg, ...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.LEFT, table, args);
  }
  leftJoinVal(table: TTableArg, ...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.LEFT, table, args, true);
  }
  rightJoin(table: TTableArg, ...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.RIGHT, table, args);
  }
  rightJoinVal(table: TTableArg, ...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.RIGHT, table, args, true);
  }
  leftOuterJoin(table: TTableArg, ...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.LEFT_OUTER, table, args);
  }
  rightOuterJoin(table: TTableArg, ...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.RIGHT_OUTER, table, args);
  }
  fullOuterJoin(table: TTableArg, ...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.FULL_OUTER, table, args);
  }
  crossJoin(table: TTableArg, ...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.CROSS, table, args);
  }

  joinRaw(node: TRawNode) {
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
  groupBy(...args: TGroupByArg[]) {
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
  having(...args: THavingConditionValueArgs) {
    return this.addValueCond(ClauseTypeEnum.HAVING, args, OperatorEnum.AND);
  }

  /**
   * Adds an ORDER BY clause to the query
   *
   * .orderBy('something', 'asc').orderBy('somethingElse', 'desc')
   */
  orderBy(column: TColumnArg, direction: TOrderByDirection = "asc") {
    if (arguments.length === 0 || column === null || column === undefined) {
      return this;
    }
    return this.chain(ast =>
      ast.set(
        "order",
        ast.order.push(
          OrderByNode({
            column: this.unwrapIdent(column),
            direction: direction.toUpperCase() as OrderByEnum,
          })
        )
      )
    );
  }

  /**
   * Shorthand for orderBy(column, "desc")
   */
  orderByDesc(column: TColumnArg) {
    return this.orderBy(column, "desc");
  }

  /**
   * Set the "offset" value of the query.
   */
  offset(value: number | TRawNode) {
    return this.chain(ast => ast.set("offset", value));
  }

  /**
   * Set the "limit" value of the query.
   */
  limit(value: number | TRawNode) {
    return this.chain(ast => ast.set("limit", value));
  }

  /**
   * Add a UNION clause to the query
   */
  union(...args: Array<TUnionArg>) {
    return this.addUnionClauses(args);
  }

  /**
   * Add a UNION ALL clause to the query
   */
  unionAll(...args: Array<TUnionArg>) {
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

  count(column: TAggregateArg) {
    return this.addAggregate(AggregateFns.COUNT, column);
  }
  countDistinct(column: TAggregateArg) {
    return this.addAggregate(AggregateFns.COUNT, column, true);
  }
  min(column: TAggregateArg) {
    return this.addAggregate(AggregateFns.MIN, column);
  }
  max(column: TAggregateArg) {
    return this.addAggregate(AggregateFns.MAX, column);
  }
  sum(column: TAggregateArg) {
    return this.addAggregate(AggregateFns.SUM, column);
  }
  sumDistinct(column: TAggregateArg) {
    return this.addAggregate(AggregateFns.SUM, column, true);
  }
  avg(column: TAggregateArg) {
    return this.addAggregate(AggregateFns.AVG, column);
  }
  avgDistinct(column: TAggregateArg) {
    return this.addAggregate(AggregateFns.AVG, column, true);
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

  fromJS(obj: FromJSArg) {
    return this;
  }

  getAst(): TSelectOperation {
    return this.ast;
  }

  toImmutable() {
    if (this.executionContext) {
      throw new Error(dedent`
        Oops, looks like you're trying to convert a builder which has already begun execution to an immutable instance.
        Execution is defined as:
          - calling .then() or .catch(), either directly or indirectly via async / await
          - calling any of the EventEmitter methods (.on, .off, etc.)
          - beginning async iteration
        As an alternative, you may instead call .clone() which clones the builder's AST and then call .toImmutable on 
      `);
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

  update() {
    throw new Error(dedent`
      The .update() method is no longer chained off of a select query, it is now 
      moved to it's own UpdateBuilder class. Check the docs for migration.
    `);
  }

  /**
   * Clears any SELECT expressions set on the builder
   */
  clearSelect() {
    return this.chain(ast => ast.set("select", selectAst.select));
  }

  /**
   * Clears any WHERE conditions set on the builder
   */
  clearWhere() {
    return this.chain(ast => ast.set("where", selectAst.where));
  }

  /**
   * Clears any HAVING conditions set on the builder
   */
  clearHaving() {
    return this.chain(ast => ast.set("having", selectAst.having));
  }

  /**
   * Clears any UNION clauses set on the builder
   */
  clearUnion() {
    return this.chain(ast => ast.set("union", selectAst.union));
  }

  /**
   * Clears any GROUP BY set on the builder
   */
  clearGroup() {
    return this.chain(ast => ast.set("group", selectAst.group));
  }

  protected addUnionClauses(args: Array<TUnionArg>, unionAll: boolean = false) {
    return this.chain(ast => {
      return ast.set(
        "union",
        args.reduce((result, arg) => {
          if (typeof arg === "function") {
            const ast = this.selectBuilder().getAst();
            return result.push(UnionNode({ ast, all: unionAll }));
          }
          return result;
        }, ast.union)
      );
    });
  }

  /**
   * Adds a JOIN clause to the query.
   */
  protected addJoinClause(joinType: JoinTypeEnum, table: TTableArg, args: any[], asVal = false): this {
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
    const joinNode = JoinNode({
      joinType,
      table: this.unwrapTable(table),
      conditions,
    });
    return this.chain(ast => ast.set("join", ast.join.push(joinNode)));
  }

  /**
   * Adds an aggregate value to the SELECT clause
   */
  protected addAggregate(fn: AggregateFns, column: TAggregateArg, distinct: boolean = false) {
    const unwrappedColumn = Array.isArray(column) ? column : this.unwrapIdent(column);
    const opts: Omit<IAggregateNode, "__typename"> = isNodeOf(unwrappedColumn, NodeTypeEnum.ALIASED)
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
    return this.chain(ast => ast.set("select", ast.select.push(AggregateNode(opts))));
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
      return arg;
    }
    if (typeof arg === "function") {
      return this.subQuery(arg);
    }
    if (isSelectBuilder(arg)) {
      return SubQueryNode({ ast: arg.getAst() });
    }
    if (isRawNode(arg)) {
      return arg;
    }
    return null;
  }

  protected subCondition(clauseType: ClauseTypeEnum, fn: Function, andOr: TAndOr, not: TNot) {
    let builder: SubHavingBuilder | SubWhereBuilder | null = null;
    if (clauseType === ClauseTypeEnum.HAVING) {
      builder = new SubHavingBuilder(this.grammar.newInstance(), this.subQuery);
    } else if (clauseType === ClauseTypeEnum.WHERE) {
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
      if (clauseType === ClauseTypeEnum.HAVING) {
        return ast.set("having", ast.having.push(node));
      }
      if (clauseType === ClauseTypeEnum.WHERE) {
        return ast.set("where", ast.where.push(node));
      }
      throw new Error(NEVER);
    });
  }

  protected subQuery = (fn: SubQueryArg) => {
    const builder = this.selectBuilder();
    fn.call(builder, builder);
    return SubQueryNode({ ast: builder.getAst() });
  };

  protected isEmpty(val: any) {
    return val === null || val === undefined || val === "";
  }

  protected chain(fn: ChainFnSelect): this {
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
  protected unwrapTable(column: TTableArg): TTable {
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
      return SubQueryNode({ ast: column.getAst() });
    }
    console.log(column);
    throw new Error(`Invalid column type provided to the query builder: ${typeof column}`);
  }

  protected getExecutionContext() {
    if (!this.executionContext) {
      this.makeExecutionContext();
    }
    return this.executionContext!;
  }

  protected makeExecutionContext() {
    if (this.forSubQuery) {
      throw new Error(dedent`
        Oops, looks like you are attempting to call .then or an EventEmitter method 
        (.on, .off, etc.) on a SubQuery. 
        This is not permitted as only the outer query may be executed or used as an
        EventEmitter.
      `);
    }
    if (!this.mutable) {
      throw new Error(dedent`
        Oops, looks like you're trying to execute a builder which is defined as an immutable instance.
        Execution is defined as:
          - calling .then() or .catch(), either directly or indirectly via async / await
          - calling any of the EventEmitter methods (.on, .off, etc.)
          - beginning async iteration
        As an alternative, you may instead call .clone() which clones the builder's AST and then execute
      `);
    }
    if (!this.connection) {
      throw new Error(dedent`
        Oops, looks like you're trying to execute a builder without a connection.
        Execution is defined as:
          - calling .then() or .catch(), either directly or indirectly via async / await
          - calling any of the EventEmitter methods (.on, .off, etc.)
          - beginning async iteration
        Be sure to provide a connection with .setConnection or use the helpers which take care of this for you.
      `);
    }
    this.executionContext = new ExecutionContext();
    return this.executionContext;
  }
}

export interface SelectBuilder<T = any> extends ExecutableBuilder<T> {
  [SELECT_BUILDER]: true;
}

SelectBuilder.prototype[SELECT_BUILDER] = true;

withEventEmitter(SelectBuilder);
withExecutionMethods(SelectBuilder);
