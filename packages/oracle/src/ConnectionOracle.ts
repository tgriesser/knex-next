import { KnexConnection } from "@knex/core";
import { IConnection } from "oracledb";

export class KnexConnectionOracle extends KnexConnection {
  constructor(connection: IConnection) {
    super(connection);
  }
  async beginTransaction() {}
}
