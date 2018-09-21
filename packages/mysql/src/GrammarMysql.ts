import { Grammar } from "@knex/core";
import sqlstring from "sqlstring";

export class KnexGrammarMysql extends Grammar {
  escapeId(id: string) {
    return sqlstring.escapeId(id);
  }
  escapeValue(val: any) {
    return sqlstring.escape(val);
  }
}
