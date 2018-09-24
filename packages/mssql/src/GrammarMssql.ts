import { Grammar } from "@knex/core";

export class GrammarMssql extends Grammar {
  escapeIdFragment(id: string) {
    return `[${id}]`;
  }
}
