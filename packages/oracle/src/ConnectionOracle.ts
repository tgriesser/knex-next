import { Connection, raw } from "@knex/core";
import { IConnection } from "oracledb";

export class ConnectionOracle extends Connection {
  constructor(connection: IConnection) {
    super(connection);
  }

  async beginTransaction() {}

  async columnInfo() {
    return [];
  }
}
