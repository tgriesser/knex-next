import { Connection, raw, ColumnInfoData, UpdateBuilder, Grammar } from "@knex/core";
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

export class UpdateBuilderPostgresql extends UpdateBuilder {
  update() {}
}

export class GrammarPostgresql extends Grammar {
  escapeIdFragment(frag: string) {
    return `"${frag}"`;
  }

  getBinding(index: number) {
    return `$${index}`;
  }
}
