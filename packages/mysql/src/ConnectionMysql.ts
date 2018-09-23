import { Connection as MysqlConnection } from "mysql";
import { Connection, raw } from "@knex/core";

export class ConnectionMysql extends Connection {
  constructor(protected connection: MysqlConnection) {
    super(connection);
  }

  get database() {
    return this.connection.config.database!;
  }

  async execute(sql: string, bindings: any[], timeout?: number) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, bindings);
    });
  }

  async beginTransaction() {}

  async columnInfo(tableName: string) {
    const { fragments, bindings } = raw`
      select * from information_schema.columns 
      where table_name = ${tableName} and table_schema = ${
      this.connection.config.database
    }`;
    const rows = await this.execute(fragments.join("?"), bindings.toArray());
    return [];
  }
}
