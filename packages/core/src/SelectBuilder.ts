import {
  selectAst,
  TRawNode,
  UnionNode,
  DialectEnum,
  TSelectNode,
  SubQueryNode,
  TSelectOperation,
  JoinTypeEnum,
} from "./data/datatypes";
import invariant from "invariant";
import dedent from "dedent";
import { WhereClauseBuilder } from "./WhereClauseBuilder";
import {
  TSelectArg,
  TTableArg,
  TUnionArg,
  SubQueryArg,
  ChainFnSelect,
  Maybe,
  FromJSArg,
} from "./data/types";
import { Grammar } from "./Grammar";
import { isRawNode, isSelectBuilder } from "./data/predicates";
import { KnexConnection } from "./Connection";
import { withEventEmitter } from "./mixins/withEventEmitter";
import { Loggable } from "./contracts/Loggable";
import { ExecutionContext } from "./ExecutionContext";

export class SelectBuilder<T = any> extends WhereClauseBuilder
  implements PromiseLike<T>, Loggable {
  /**
   * Whether the builder is "mutable". Immutable builders are useful
   * when building subQueries or statements we want to ensure aren't
   * changed, but aren't good if we want to actually use them to
   * execute queries.
   */
  private mutable = true;

  /**
   * Useful if we want to check the builder's dialect from userland.
   */
  public readonly dialect: Maybe<DialectEnum> = null;

  /**
   * Grammar deals with escaping / parameterizing values
   */
  protected grammar = new Grammar();

  /**
   * The connection we're using to execute the queries.
   */
  protected connection: Maybe<KnexConnection> = null;

  /**
   * If we've executed the promise, cache it on the class body
   * to fulfill the promises spec.
   */
  protected _promise: Maybe<Promise<T>> = null;

  /**
   * All events, row iteration, and query execution takes place in
   * an "Execution Context", a combination of a connection, a grammar,
   * and an EventEmitter.
   */
  protected executionContext: Maybe<ExecutionContext> = null;

  constructor(protected ast = selectAst, protected forSubQuery = false) {
    super();
  }

  clone(): this {
    return new (<typeof SelectBuilder>this.constructor)(this.ast) as this;
  }

  select(...args: Array<TSelectArg>): this {
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
   */
  distinct(): this {
    return this.chain(ast => {
      return ast.set("distinct", true);
    });
  }

  /**
   * Adds the table for the "from"
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

  join(raw: TRawNode): this;
  join(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.INNER, args);
  }
  joinWhere(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.INNER, args, true);
  }
  leftJoin(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.LEFT, args);
  }
  leftJoinWhere(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.LEFT, args, true);
  }
  rightJoin(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.RIGHT, args);
  }
  rightJoinWhere(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.RIGHT, args, true);
  }
  leftOuterJoin(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.LEFT_OUTER, args);
  }
  rightOuterJoin(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.RIGHT_OUTER, args);
  }
  fullOuterJoin(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.FULL_OUTER, args);
  }
  crossJoin(...args: any[]) {
    return this.addJoinClause(JoinTypeEnum.CROSS, args);
  }
  joinRaw(node: TRawNode) {
    invariant(
      isRawNode(node),
      "Expected joinRaw to be provided with a knex template tag literal, instead saw a %s",
      typeof node
    );
    return this.chain(ast => ast.set("join", ast.join.push(node)));
  }
  protected addJoinClause(
    joinType: JoinTypeEnum,
    args: any[],
    asWhere = false
  ) {
    return this.chain(ast => {
      // const joinNode = unpackJoin(args);
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
      return ast.set(
        "union",
        args.reduce((result, arg) => {
          if (typeof arg === "function") {
            const ast = new (this
              .constructor as typeof SelectBuilder)().getAst();
            return result.push(UnionNode({ ast }));
          }
          return result;
        }, ast.union)
      );
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

  value() {
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

  protected subQuery(fn: SubQueryArg) {
    const builder = new (<typeof SelectBuilder>this.constructor)();
    fn.call(builder, builder);
    return SubQueryNode({ ast: builder.getAst() });
  }

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

  setConnection(connection: KnexConnection) {
    this.connection = connection;
    return this;
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>),
    onRejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    if (!this._promise) {
      try {
        this._promise = this.getExecutionContext().asPromise();
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return this._promise.then(onFulfilled, onRejected);
  }

  catch<TResult = never>(
    onRejected:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ) {
    if (!this._promise) {
      return this.then().catch(onRejected);
    }
    return this._promise.catch(onRejected);
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
        Oops, looks like you are attempting to call .then or an event emitter method 
        (.on, .off, etc.) on a SubQuery. 
        This is not permitted as only the outer query may be executed or used as an
        event emitter.
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

  as(val: string) {
    return this.chain(ast => ast.set("alias", val));
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

withEventEmitter(SelectBuilder);
