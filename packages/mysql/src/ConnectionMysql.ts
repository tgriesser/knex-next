import { Connection } from "mysql";
import { KnexConnection, raw, Types } from "@knex/core";
import { GrammarMysql } from "./GrammarMysql";

export class ConnectionMysql extends KnexConnection {
  constructor(protected connection: Connection) {
    super(connection);
  }

  get grammar() {
    return new GrammarMysql();
  }

  get database() {
    return this.connection.config.database!;
  }

  async execute<T>(sql: string, bindings: any[], timeout?: number) {
    return new Promise<T>((resolve, reject) => {
      this.connection.query(sql, bindings, (err, result: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async executeRaw(node: Types.TRawNode) {}

  async columnInfo(tableName: string) {
    const { fragments, bindings } = raw`
      select * from information_schema.columns 
      where table_name = ${tableName} and table_schema = ${this.connection.config.database}`;
    const rows = await this.execute(fragments.join("?"), bindings.toArray());
    return [];
  }
}
