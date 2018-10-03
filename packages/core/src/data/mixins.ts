import { EventEmitter } from "events";
import { Connection } from "../Connection";
import { ExecutionContext } from "../ExecutionContext";
import * as Messages from "./Messages";

export function withEventEmitter(ClassToDecorate: any) {
  Object.keys(EventEmitter.prototype).forEach(key => {
    // @ts-ignore
    ClassToDecorate.prototype[key] = EventEmitter.prototype[key];
  });
}

/**
 * Typings are taken care of on the type defs for ExecutableBuilder,
 * but basically this just mixes in all of the prototype properties &
 * methods that are common to all the builders, without needing to independently
 * define them on each.
 */
export function withExecutionMethods(ClassToDecorate: any) {
  /**
   * The connection we're using to execute the queries.
   */
  ClassToDecorate.prototype.connection = null;

  ClassToDecorate.prototype.setConnection = function setConnection(connection: Connection) {
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

  ClassToDecorate.prototype.log = function log(msg: string) {
    console.log(msg);
  };

  ClassToDecorate.prototype.error = function error(err: Error) {
    console.error(err);
  };

  ClassToDecorate.prototype.warn = function warn(warning: string | Error) {
    console.warn(warning);
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
}

/**
 * Adds a RETURNING clause support to the databases that support it
 */
export function returningMixin(ClassToDecorate: any) {
  ClassToDecorate.prototype.returning = function returning() {};
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
