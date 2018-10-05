import { EventEmitter } from "events";
import { KnexConnection } from "../Connection";
import { ExecutionContext } from "../ExecutionContext";
import * as Messages from "./Messages";
import { Types } from ".";
import { ToSQLValue } from "./types";
import { KnexConnectionPool } from "../ConnectionPool";

export interface EventEmitterMixin extends EventEmitter {}

export function withEventEmitter(ClassToDecorate: any) {
  Object.keys(EventEmitter.prototype).forEach(key => {
    // @ts-ignore
    ClassToDecorate.prototype[key] = EventEmitter.prototype[key];
  });
}

/**
 * When a Builder is executable, it is a promise and contains all of these methods
 */
export interface ExecutionMethods<T = any> extends EventEmitter, LogMixin, Promise<T> {
  /**
   * Sets the current connection on the class
   */
  setConnection(connection: KnexConnection | KnexConnectionPool): this;
  /**
   * Build the query
   */
  toOperation(): ToSQLValue;
}

export interface LogMixin {
  /**
   * Logs a message
   */
  log(msg: string): void;
  /**
   * Logs an error
   */
  error(err: Error): void;
  /**
   * Logs a warning
   */
  warn(msg: string | Error): void;
}

export function withLogMixin(ClassToDecorate: any) {
  ClassToDecorate.prototype.log = function log(msg: string) {
    console.log(msg);
  };
  ClassToDecorate.prototype.error = function error(err: Error) {
    console.error(err);
  };
  ClassToDecorate.prototype.warn = function warn(warning: string | Error) {
    console.warn(warning);
  };
}

/**
 * Typings are taken care of on the type defs for ExecutableBuilder,
 * but basically this just mixes in all of the prototype properties &
 * methods that are common to all the builders, without needing to independently
 * define them on each.
 */
export function withExecutionMethods(ClassToDecorate: any) {
  /**
   * Add log methods to any executing builder
   */
  withLogMixin(ClassToDecorate);

  /**
   * Add event emitter methods to any executing builder
   */
  withEventEmitter(ClassToDecorate);

  /**
   * The connection we're using to execute the queries.
   */
  ClassToDecorate.prototype.connection = null;

  ClassToDecorate.prototype.setConnection = function setConnection(connection: KnexConnection) {
    this.connection = connection;
    return this;
  };

  /**
   * If we've executed the promise, cache it on the class body
   * to fulfill the promises spec.
   */
  ClassToDecorate.prototype._promise = null;

  ClassToDecorate.prototype.then = function then(onFulfilled?: any, onRejected?: any) {
    if (!this._promise) {
      try {
        this._promise = this.getExecutionContext().asPromise();
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return this._promise.then(onFulfilled, onRejected);
  };

  ClassToDecorate.prototype.catch = function _catch(onRejected: any) {
    if (!this._promise) {
      return this.then().catch(onRejected);
    }
    return this._promise.catch(onRejected);
  };

  ClassToDecorate.prototype.toOperation = function toOperation() {
    return this.grammar.toOperation(this.ast);
  };

  ClassToDecorate.prototype.getExecutionContext = function getExecutionContext() {
    if (!this.executionContext) {
      this.makeExecutionContext();
    }
    return this.executionContext!;
  };

  ClassToDecorate.prototype.makeExecutionContext = function makeExecutionContext() {
    if (this.forSubQuery) {
      throw new Error(Messages.SUBQUERY_EXECUTION);
    }
    if (!this.mutable) {
      throw new Error(Messages.IMMUTABLE_EXECUTION);
    }
    if (!this.connection) {
      throw new Error(Messages.MISSING_CONNECTION);
    }
    this.executionContext = new ExecutionContext();
    return this.executionContext;
  };

  ClassToDecorate.prototype.asCallback = function asCallback<T>(cb: (err: Error | null, value?: T) => any) {
    this.then((data: T) => cb(null, data)).catch((e: Error) => cb(e));
  };
}

export interface ReturningMixin {
  returning(...args: string[] | [string[]]): this;
}

/**
 * Adds a RETURNING clause support to the databases that support it
 */
export function returningMixin(ClassToDecorate: any) {
  ClassToDecorate.prototype.returning = function returning() {};
}

export interface CTEMixin {
  with(alias: string, as: Types.TQueryArg): this;
  withRecursive(...args: string[] | [string[]]): this;
}

/**
 * Adds common table expressions (WITH, WITH RECURSIVE) support for the databases
 * that support it
 */
export function commonTableExpressions(ClassToDecorate: any) {
  ClassToDecorate.prototype.with = function _with() {
    return;
  };

  ClassToDecorate.prototype.withRecursive = function withRecursive() {
    return;
  };
}
