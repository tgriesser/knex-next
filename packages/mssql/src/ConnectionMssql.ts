import { KnexConnection } from "@knex/core";
import { ConnectionPool } from "mssql";

export class KnexConnectionMssql extends KnexConnection {
  constructor(protected connection: ConnectionPool) {
    super(connection);
  }
  async beginTransaction() {}
}
