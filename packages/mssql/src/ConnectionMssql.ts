import { KnexConnection } from "@knex/core";
import { ConnectionPool } from "mssql";

export class KnexConnectionMssql extends KnexConnection {
  database = "mssql";

  constructor(protected connection: ConnectionPool) {
    super(connection);
  }
  async beginTransaction() {}

  async columnInfo(tableName: string) {
    return [];
  }
}
