import { SelectBuilder } from "@knex/core";
import { GrammarMysql } from "./GrammarMysql";

export class SelectBuilderMysql extends SelectBuilder {
  grammar = new GrammarMysql();
}
