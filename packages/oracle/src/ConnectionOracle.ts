import { KnexConnection } from "@knex/core";
import { IConnection } from "oracledb";

export class ConnectionOracle extends KnexConnection {
  database = "oracle";

  constructor(connection: IConnection) {
    super(connection);
  }

  async beginTransaction() {}

  async columnInfo() {
    return [];
  }
}
