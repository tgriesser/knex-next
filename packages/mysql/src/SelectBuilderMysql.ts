import { SelectBuilder } from "@knex/core";
import { GrammarMysql } from "@knex/mysql/src/GrammarMysql";
export class SelectBuilderMysql extends SelectBuilder {
  grammar = new GrammarMysql();
}
