import { Types } from "./data";
import { KnexConnection } from "./Connection";
import { EventEmitter } from "events";
import { TransactionBlock } from "./TransactionBlock";
import { KnexConnectionPool } from "./ConnectionPool";

/**
 * A knex "object" for a particular connection.
 *
 * This is called with the Builder classes, specific to each dialect,
 * along with an object which is either a Connection or a ConnectionPool.
 *
 * The ConnectionPool automatically disposes the underlying connection
 * object back to the pool after uses. A Connection waits until it is released,
 * e.g. committed/rolled back via a transaction.
 */
export class KnexConnectionInstance extends EventEmitter {
  constructor(protected builders: Types.BuildersObject, protected connection: KnexConnection | KnexConnectionPool) {
    super();
  }

  /**
   * INSERT INTO _____ ....
   */
  insertInto() {
    return new this.builders.InsertBuilder().setConnection(this.connection);
  }

  /**
   * UPDATE _____ ....
   */
  update() {
    return new this.builders.UpdateBuilder().setConnection(this.connection);
  }

  /**
   * DELETE FROM ____ ...
   */
  deleteFrom() {
    return new this.builders.DeleteBuilder().setConnection(this.connection);
  }

  /**
   * SELECT ____
   */
  select() {
    return new this.builders.SelectBuilder().setConnection(this.connection);
  }

  /**
   * Creates a transaction block. The BEGIN TRANSACTION is issued immediately
   */
  transaction<T = any>(fn?: Types.TransactionBlockFn<T>) {
    if (typeof fn === "function") {
      return new TransactionBlock();
    }
  }
}
