import { Grammar } from "@knex/core";

export class GrammarPostgres extends Grammar {
  escapeIdFragment(frag: string) {
    return `"${frag}"`;
  }

  getBinding(index: number) {
    return `$${index}`;
  }
}
