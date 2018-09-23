import { Connection, raw, ColumnInfoData } from "@knex/core";
import { Client } from "pg";

export class ConnectionPostgresql extends Connection {
  constructor(protected connection: Client) {
    super(connection);
  }

  async beginTransaction() {}

  async commit() {}

  async rollback() {}

  get database() {
    return "database";
  }

  async execute(query: string, values: any[]) {}

  async columnInfo(tableName: string) {
    const info: ColumnInfoData[] = [];
    return info;
  }
}
