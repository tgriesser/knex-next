import { KnexConnection } from "@knex/core";
import { Database } from "sqlite3";

export class KnexConnectionSqlite3 extends KnexConnection {
  constructor(connection: Database) {
    super(connection);
  }
  async beginTransaction() {}
}
