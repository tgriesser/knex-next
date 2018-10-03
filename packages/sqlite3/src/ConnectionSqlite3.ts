import { Connection } from "@knex/core";
import { Database } from "sqlite3";

export class ConnectionSqlite3 extends Connection {
  database = "sqlite3";

  constructor(connection: Database) {
    super(connection);
  }

  async beginTransaction() {}

  async columnInfo() {
    return [];
  }
}
