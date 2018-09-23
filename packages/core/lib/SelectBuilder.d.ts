import { TRawNode, DialectEnum, TSelectNode, TSelectOperation, JoinTypeEnum } from "./data/datatypes";
import { WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { TSelectArg, TTableArg, TUnionArg, SubQueryArg, ChainFnSelect, Maybe, FromJSArg } from "./data/types";
import { Grammar } from "./Grammar";
import { Connection } from "./Connection";
import { Loggable } from "./contracts/Loggable";
import { ExecutionContext } from "./ExecutionContext";
export declare class SelectBuilder<T = any> extends WhereClauseBuilder implements PromiseLike<T>, Loggable {
    protected ast: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ISelectOperation>;
    protected forSubQuery: boolean;
    /**
     * Whether the builder is "mutable". Immutable builders are useful
     * when building subQueries or statements we want to ensure aren't
     * changed, but aren't good if we want to actually use them to
     * execute queries.
     */
    protected mutable: boolean;
    /**
     * Useful if we want to check the builder's dialect from userland.
     */
    readonly dialect: Maybe<DialectEnum>;
    /**
     * Grammar deals with escaping / parameterizing values
     */
    protected grammar: Grammar;
    /**
     * The connection we're using to execute the queries.
     */
    protected connection: Maybe<Connection>;
    /**
     * If we've executed the promise, cache it on the class body
     * to fulfill the promises spec.
     */
    protected _promise: Maybe<Promise<T>>;
    /**
     * All events, row iteration, and query execution takes place in
     * an "Execution Context", a combination of a connection, a grammar,
     * and an EventEmitter.
     */
    protected executionContext: Maybe<ExecutionContext>;
    constructor(ast?: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ISelectOperation>, forSubQuery?: boolean);
    clone(): this;
    select(...args: Array<TSelectArg>): this;
    /**
     * Force the query to only return distinct results.
     */
    distinct(): this;
    /**
     * Adds the table for the "from"
     */
    from(table: TTableArg): this;
    join(raw: TRawNode): this;
    joinWhere(...args: any[]): this;
    leftJoin(...args: any[]): this;
    leftJoinWhere(...args: any[]): this;
    rightJoin(...args: any[]): this;
    rightJoinWhere(...args: any[]): this;
    leftOuterJoin(...args: any[]): this;
    rightOuterJoin(...args: any[]): this;
    fullOuterJoin(...args: any[]): this;
    crossJoin(...args: any[]): this;
    joinRaw(node: TRawNode): this;
    protected addJoinClause(joinType: JoinTypeEnum, args: any[], asWhere?: boolean): this;
    groupBy(): this;
    orderBy(): this;
    orderByDesc(): this;
    /**
     * Set the "offset" value of the query.
     */
    offset(value: number | TRawNode): this;
    /**
     * Set the "limit" value of the query.
     */
    limit(value: number | TRawNode): this;
    union(...args: Array<TUnionArg>): this;
    unionAll(...args: Array<TUnionArg>): this;
    protected addUnionClauses(args: Array<TUnionArg>, unionAll?: boolean): this;
    lock(value?: boolean | string): this;
    lockForUpdate(): this;
    sharedLock(): this;
    value(): this;
    exists(): this;
    doesntExist(): this;
    count(): this;
    min(): this;
    max(): this;
    sum(): this;
    avg(): this;
    average(): this;
    aggregate(): this;
    numericAggregate(): this;
    cloneWithout(): this;
    toString(): string;
    toSql(): string;
    toOperation(): import("@knex/core/src/Grammar").ToSQLValue;
    /**
     * A select argument can be a "string", a "function" (SubQuery),
     * an instance of a SelectBuilder, or RawNode.
     */
    protected selectArg(arg: TSelectArg): Maybe<TSelectNode>;
    protected fromSub(): this;
    protected selectSub(): this;
    protected joinSub(): this;
    protected subQuery(fn: SubQueryArg): import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ISubQuery>;
    protected isEmpty(val: any): boolean;
    protected chain(fn: ChainFnSelect): this;
    fromJS(obj: FromJSArg): this;
    getAst(): TSelectOperation;
    toImmutable(): this;
    toMutable(): this;
    setConnection(connection: Connection): this;
    then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>), onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onRejected: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    protected getExecutionContext(): ExecutionContext;
    protected makeExecutionContext(): ExecutionContext;
    as(val: string): this;
    log(msg: string): void;
    error(err: Error): void;
    warn(warning: string | Error): void;
}
