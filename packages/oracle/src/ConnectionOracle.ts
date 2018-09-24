import { Connection, raw } from "@knex/core";
import { IConnection } from "oracledb";

export class ConnectionOracle extends Connection {
  database = "oracle";

  constructor(connection: IConnection) {
    super(connection);
  }

  async beginTransaction() {}

  async columnInfo() {
    return [];
  }
}
