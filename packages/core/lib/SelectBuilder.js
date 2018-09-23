"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const datatypes_1 = require("./data/datatypes");
const invariant_1 = __importDefault(require("invariant"));
const dedent_1 = __importDefault(require("dedent"));
const WhereClauseBuilder_1 = require("./clauses/WhereClauseBuilder");
const Grammar_1 = require("./Grammar");
const predicates_1 = require("./data/predicates");
const withEventEmitter_1 = require("./mixins/withEventEmitter");
const ExecutionContext_1 = require("./ExecutionContext");
class SelectBuilder extends WhereClauseBuilder_1.WhereClauseBuilder {
    constructor(ast = datatypes_1.selectAst, forSubQuery = false) {
        super();
        this.ast = ast;
        this.forSubQuery = forSubQuery;
        /**
         * Whether the builder is "mutable". Immutable builders are useful
         * when building subQueries or statements we want to ensure aren't
         * changed, but aren't good if we want to actually use them to
         * execute queries.
         */
        this.mutable = true;
        /**
         * Useful if we want to check the builder's dialect from userland.
         */
        this.dialect = null;
        /**
         * Grammar deals with escaping / parameterizing values
         */
        this.grammar = new Grammar_1.Grammar();
        /**
         * The connection we're using to execute the queries.
         */
        this.connection = null;
        /**
         * If we've executed the promise, cache it on the class body
         * to fulfill the promises spec.
         */
        this._promise = null;
        /**
         * All events, row iteration, and query execution takes place in
         * an "Execution Context", a combination of a connection, a grammar,
         * and an EventEmitter.
         */
        this.executionContext = null;
    }
    clone() {
        return new this.constructor(this.ast);
    }
    select(...args) {
        return this.chain(ast => {
            return ast.set("select", args.reduce((result, arg) => {
                const node = this.selectArg(arg);
                return node ? result.push(node) : result;
            }, ast.select));
        });
    }
    /**
     * Force the query to only return distinct results.
     */
    distinct() {
        return this.chain(ast => {
            return ast.set("distinct", true);
        });
    }
    /**
     * Adds the table for the "from"
     */
    from(table) {
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
    join(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.INNER, args);
    }
    joinWhere(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.INNER, args, true);
    }
    leftJoin(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.LEFT, args);
    }
    leftJoinWhere(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.LEFT, args, true);
    }
    rightJoin(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.RIGHT, args);
    }
    rightJoinWhere(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.RIGHT, args, true);
    }
    leftOuterJoin(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.LEFT_OUTER, args);
    }
    rightOuterJoin(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.RIGHT_OUTER, args);
    }
    fullOuterJoin(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.FULL_OUTER, args);
    }
    crossJoin(...args) {
        return this.addJoinClause(datatypes_1.JoinTypeEnum.CROSS, args);
    }
    joinRaw(node) {
        invariant_1.default(predicates_1.isRawNode(node), "Expected joinRaw to be provided with a knex template tag literal, instead saw a %s", typeof node);
        return this.chain(ast => ast.set("join", ast.join.push(node)));
    }
    addJoinClause(joinType, args, asWhere = false) {
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
    offset(value) {
        return this.chain(ast => {
            return ast;
        });
    }
    /**
     * Set the "limit" value of the query.
     */
    limit(value) {
        return this.chain(ast => {
            return ast;
        });
    }
    union(...args) {
        return this.addUnionClauses(args);
    }
    unionAll(...args) {
        return this.addUnionClauses(args, true);
    }
    addUnionClauses(args, unionAll = false) {
        return this.chain(ast => {
            return ast.set("union", args.reduce((result, arg) => {
                if (typeof arg === "function") {
                    const ast = new this
                        .constructor().getAst();
                    return result.push(datatypes_1.UnionNode({ ast }));
                }
                return result;
            }, ast.union));
        });
    }
    lock(value = true) {
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
    selectArg(arg) {
        if (arg === null || arg === undefined) {
            return null;
        }
        if (typeof arg === "string") {
            return arg;
        }
        if (typeof arg === "function") {
            return this.subQuery(arg);
        }
        if (arg instanceof SelectBuilder) {
            return datatypes_1.SubQueryNode({ ast: arg.getAst() });
        }
        if (predicates_1.isRawNode(arg)) {
            return arg;
        }
        return null;
    }
    fromSub() {
        return this.chain(ast => {
            return ast;
        });
    }
    selectSub() {
        return this.chain(ast => {
            return ast;
        });
    }
    joinSub() {
        return this.chain(ast => {
            return ast;
        });
    }
    subQuery(fn) {
        const builder = new this.constructor();
        fn.call(builder, builder);
        return datatypes_1.SubQueryNode({ ast: builder.getAst() });
    }
    isEmpty(val) {
        return val === null || val === undefined || val === "";
    }
    chain(fn) {
        if (this.mutable) {
            this.ast = fn(this.ast);
            return this;
        }
        return new this.constructor(fn(this.ast));
    }
    fromJS(obj) {
        return this;
    }
    getAst() {
        return this.ast;
    }
    toImmutable() {
        if (this.executionContext) {
            throw new Error(dedent_1.default `
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
    setConnection(connection) {
        this.connection = connection;
        return this;
    }
    then(onFulfilled, onRejected) {
        if (!this._promise) {
            try {
                this._promise = this.getExecutionContext().asPromise();
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        return this._promise.then(onFulfilled, onRejected);
    }
    catch(onRejected) {
        if (!this._promise) {
            return this.then().catch(onRejected);
        }
        return this._promise.catch(onRejected);
    }
    getExecutionContext() {
        if (!this.executionContext) {
            this.makeExecutionContext();
        }
        return this.executionContext;
    }
    makeExecutionContext() {
        if (this.forSubQuery) {
            throw new Error(dedent_1.default `
        Oops, looks like you are attempting to call .then or an event emitter method 
        (.on, .off, etc.) on a SubQuery. 
        This is not permitted as only the outer query may be executed or used as an
        event emitter.
      `);
        }
        if (!this.mutable) {
            throw new Error(dedent_1.default `
        Oops, looks like you're trying to execute a builder which is defined as an immutable instance.
        Execution is defined as:
          - calling .then() or .catch(), either directly or indirectly via async / await
          - calling any of the EventEmitter methods (.on, .off, etc.)
          - beginning async iteration
        As an alternative, you may instead call .clone() which clones the builder's AST and then execute
      `);
        }
        if (!this.connection) {
            throw new Error(dedent_1.default `
        Oops, looks like you're trying to execute a builder without a connection.
        Execution is defined as:
          - calling .then() or .catch(), either directly or indirectly via async / await
          - calling any of the EventEmitter methods (.on, .off, etc.)
          - beginning async iteration
        Be sure to provide a connection with .setConnection or use the helpers which take care of this for you.
      `);
        }
        this.executionContext = new ExecutionContext_1.ExecutionContext();
        return this.executionContext;
    }
    as(val) {
        return this.chain(ast => ast.set("alias", val));
    }
    log(msg) {
        console.log(msg);
    }
    error(err) {
        console.error(err);
    }
    warn(warning) {
        console.warn(warning);
    }
}
exports.SelectBuilder = SelectBuilder;
withEventEmitter_1.withEventEmitter(SelectBuilder);
