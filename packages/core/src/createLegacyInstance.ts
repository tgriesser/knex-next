import { Types, Mixins } from "./data";
import { KnexConnection } from "./Connection";
import { EventEmitter } from "events";
import { SelectBuilder } from "./SelectBuilder";
import { LegacyTransactionBlock } from "./TransactionBlock";
import { KnexConnectionPool } from "./ConnectionPool";
import { UpdateBuilder } from "./UpdateBuilder";
import { ArgumentTypes } from "./data/types";
import { InsertBuilder } from "./InsertBuilder";
import { DeleteBuilder } from "./DeleteBuilder";

const PROXIED_EVENTS = ["start", "query", "query-error", "query-response"];

/**
 * Prepares a builder that behaves as close as possible to the v1 API
 */
export function createLegacyKnexConnectionInstance(
  builders: Types.BuildersObject,
  connection: KnexConnection | KnexConnectionPool
): Types.LegacyKnex {
  /**
   * Creates a new knex builder
   */
  function knex(tableName: string) {
    /**
     * Keeping these around for easier adoption,
     * knex(tableName).update(values)
     * knex(tableName).insert(values)
     * are likely fairly common use-cases.
     */
    const knexInstance = {
      update(...args: ArgumentTypes<UpdateBuilder["set"]>) {
        return new UpdateBuilder()
          .setConnection(connection)
          .table(tableName)
          .set(...args);
      },
      insert(...args: ArgumentTypes<InsertBuilder["values"]>) {
        return new InsertBuilder()
          .setConnection(connection)
          .into(tableName)
          .values(...args);
      },
      delete() {
        return new DeleteBuilder().setConnection(connection).from(tableName);
      },
      del() {
        return new DeleteBuilder().setConnection(connection).from(tableName);
      },
    };

    return knexInstance;
  }

  Object.defineProperty(knex, "schema", {
    get() {
      return new builders.SchemaBuilder();
    },
  });

  /**
   * Legacy behavior, ensures all events are proxied from the builder
   * to the knex instance.
   */
  function makeBuilder<T extends Mixins.ExecutionMethods>(builderFactory: () => T): T {
    const builder = builderFactory().setConnection(connection);
    PROXIED_EVENTS.forEach(evt => {
      builder.on(evt, (...args) => {
        // @ts-ignore
        knex.emit(evt, ...args);
      });
    });
    return builder;
  }

  /**
   * SELECT ____ ...
   */
  knex.select = function select(...args: Types.ArgumentTypes<SelectBuilder["select"]>) {
    return makeBuilder(() => new builders.SelectBuilder()).select(...args);
  };

  /**
   * TRUNCATE ____
   */
  knex.truncate = function truncate(table: string) {
    return makeBuilder(() => new builders.TruncateBuilder()).table(table);
  };

  /**
   * Creates a transaction block. The BEGIN TRANSACTION is issued immediately
   */
  knex.transaction = function legacyTransaction(fn: Types.LegacyTransactionBlock) {
    return new LegacyTransactionBlock(fn, builders, connection);
  };

  // Not using Mixins.withEventEmitter here since we want to assign on
  // the knex fn directly rather than the prototype.
  Object.keys(EventEmitter.prototype).forEach(key => {
    // @ts-ignore
    knex[key] = EventEmitter.prototype[key];
  });

  return knex as any;
}

export function createLegacyKnexTransactionInstance(
  builders: Types.BuildersObject,
  connection: KnexConnection
): Types.LegacyKnexTransaction {
  const trxKnex = createLegacyKnexConnectionInstance(builders, connection);

  trxKnex.commit = async function commit() {
    //
  };

  trxKnex.rollback = async function rollback() {
    //
  };

  return trxKnex;
}
