import { Grammar, Structs, Types } from "@knex/core";
import sqlstring from "sqlstring";

export class GrammarMysql extends Grammar {
  escapeIdFragment(id: string) {
    return sqlstring.escapeId(id);
  }
  escapeValue(val: any) {
    return sqlstring.escape(val);
  }
  buildUpdate(ast: Types.TUpdateOperation) {
    if (ast === Structs.updateAst) {
      return;
    }
    this.addKeyword("UPDATE ");
    this.currentFragment += this.escapeId(ast.table);
    this.addJoinClauses(ast.join);
  }
}
