import { Grammar, SchemaGrammar } from "@knex/core";

export class GrammarMssql extends Grammar {
  escapeIdFragment(id: string) {
    return `[${id}]`;
  }
}

export class SchemaGrammarMssql extends SchemaGrammar {}
