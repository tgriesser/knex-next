import { Types, predicates } from "./data";
import { KnexConnection } from "./Connection";
import { EventEmitter } from "events";
import { createLegacyKnexConnectionInstance } from "./createLegacyInstance";
import { KnexConnectionPool } from "./ConnectionPool";

export class TransactionBlock<T> {}

/**
 * The legacy transaction block is also an EventEmitter
 */
export class LegacyTransactionBlock<T> extends EventEmitter implements Promise<T> {
  _promise: Promise<any>;

  constructor(
    fn: Types.TransactionBlockFn<T>,
    builders: Types.BuildersObject,
    connection: KnexConnection | KnexConnectionPool
  ) {
    super();
    this._promise = this.makePromise(fn, builders, connection);
  }

  then<TResult1 = T, TResult2 = never>() {
    return this._promise.then(...arguments);
  }
  catch() {
    return this._promise.catch(...arguments);
  }

  protected async makePromise(
    fn: Types.TransactionBlockFn<T>,
    builders: Types.BuildersObject,
    connection: KnexConnection | KnexConnectionPool
  ) {
    // First, get the connection
    const trxConn = await connection.forTransaction();
    const knexTrx = createLegacyKnexConnectionInstance(builders, trxConn);
    try {
      const result = fn(knexTrx);
      if (predicates.isThenable(result)) {
        return await result;
      } else {
        // Wait until the "commit/rollback" are
        // called on the connection. Once they are we can
        // release the connection.
        return await trxConn.isFulfilled();
      }
    } finally {
      await trxConn.release();
    }
  }

  readonly [Symbol.toStringTag]: "Promise";
}
