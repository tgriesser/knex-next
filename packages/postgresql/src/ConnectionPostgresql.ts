import { KnexConnection } from "@knex/core";
import { Connection } from "pg";

export class KnexConnectionPostgresql extends KnexConnection {
  constructor(protected connection: Connection) {
    super(connection);
  }
  async beginTransaction() {}
}
