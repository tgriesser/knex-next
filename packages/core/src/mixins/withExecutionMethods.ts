import { Connection } from "../Connection";

/**
 * Typings are taken care of on the type defs for ExecutableBuilder
 */
export function withExecutionMethods(ClassToDecorate: any) {
  ClassToDecorate.prototype.connection = null;

  ClassToDecorate.prototype.setConnection = function setConnection(connection: Connection) {
    this.connection = connection;
    return this;
  };

  ClassToDecorate.prototype._promise = null;

  ClassToDecorate.prototype.then = function then(onFulfilled: any, onRejected: any) {
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

  ClassToDecorate.prototype.toOperation = function toOperation() {
    return this.grammar.toOperation(this.ast);
  };
}
