import { Grammar } from "@knex/core";
import sqlstring from "sqlstring";

export class GrammarMysql extends Grammar {
  escapeIdFragment(id: string) {
    return sqlstring.escapeId(id);
  }
  escapeValue(val: any) {
    return sqlstring.escape(val);
  }
}
