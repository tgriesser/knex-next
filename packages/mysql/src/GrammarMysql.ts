import { Grammar } from "@knex/core";
import sqlstring from "sqlstring";

export class GrammarMysql extends Grammar {
  escapeId(id: string) {
    return id
      .split(".")
      .map(piece => (piece === "*" ? "*" : sqlstring.escapeId(piece)))
      .join(".");
  }
  escapeValue(val: any) {
    return sqlstring.escape(val);
  }
}
