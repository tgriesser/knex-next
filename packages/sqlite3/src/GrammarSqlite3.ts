import { Grammar, Structs, Types } from "@knex/core";

export class GrammarSqlite3 extends Grammar {
  escapeIdFragment(id: string) {
    return `"${id}"`;
  }
}
