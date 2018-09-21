import { Connection } from "mysql";
import { KnexConnection } from "@knex/core";

export class KnexConnectionMysql extends KnexConnection {
  constructor(protected connection: Connection) {
    super(connection);
  }

  async beginTransaction() {}
}
