import { Grammar } from "@knex/core";

export class GrammarPostgresql extends Grammar {
  escapeId() {}

  getBinding(index: number) {
    return `$${index}`;
  }
}
