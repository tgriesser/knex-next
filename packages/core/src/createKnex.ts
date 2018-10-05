import { KnexConnectionInstance } from "./createKnexConnectionInstance";
import { SelectBuilder } from "./SelectBuilder";
import { InsertBuilder } from "./InsertBuilder";
import { UpdateBuilder } from "./UpdateBuilder";
import { DeleteBuilder } from "./DeleteBuilder";
import { TruncateBuilder } from "./TruncateBuilder";
import { KnexConnectionPool } from "./ConnectionPool";
import { SchemaBuilder } from "./SchemaBuilder";
import { createLegacyKnexConnectionInstance } from "./createLegacyInstance";

/**
 * Creates a new knex instance. This core createKnex isn't very useful as
 * it doesn't have a dialect and therefore won't be able to execute anything,
 * but it's here as a template of how to `createKnex` in the individual dialects.
 *
 * By default we draw connections from the pool via a Proxied connection,
 * a class which has knowledge of the pool and knows to dispose the connection
 * back to the pool once the query is completed.
 */
export function createKnex(pool = new KnexConnectionPool()) {
  return new KnexConnectionInstance(
    {
      SchemaBuilder,
      SelectBuilder,
      InsertBuilder,
      UpdateBuilder,
      DeleteBuilder,
      TruncateBuilder,
    },
    pool
  );
}

/**
 * createLegacyKnex() is the entry point for creating a
 * new knex builder for an application, compatible as much
 * as possible with the behavior of the pre v2 API.
 */
export function createLegacyKnex(pool = new KnexConnectionPool()) {
  // We want to add in the relevant mixins for postProcessResponse.
  return createLegacyKnexConnectionInstance(
    {
      SchemaBuilder,
      SelectBuilder,
      InsertBuilder,
      UpdateBuilder,
      DeleteBuilder,
      TruncateBuilder,
    },
    pool
  );
}
