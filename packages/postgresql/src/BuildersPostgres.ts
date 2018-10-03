import { SelectBuilder, DeleteBuilder, UpdateBuilder, Enums, InsertBuilder } from "@knex/core";
import { GrammarPostgres } from "./GrammarPostgres";

export class SelectBuilderPostgres extends SelectBuilder {
  dialect = Enums.DialectEnum.POSTGRESQL;
  protected grammar = new GrammarPostgres();
}

export class DeleteBuilderPostgres extends DeleteBuilder {
  dialect = Enums.DialectEnum.POSTGRESQL;
  protected grammar = new GrammarPostgres();
}

export class UpdateBuilderPostgres extends UpdateBuilder {
  dialect = Enums.DialectEnum.POSTGRESQL;
  protected grammar = new GrammarPostgres();
}

export class InsertBuilderPostgres extends InsertBuilder {
  dialect = Enums.DialectEnum.POSTGRESQL;
  protected grammar = new GrammarPostgres();
}
