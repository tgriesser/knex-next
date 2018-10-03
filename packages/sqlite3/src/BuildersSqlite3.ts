import { SelectBuilder, DeleteBuilder, UpdateBuilder, Enums, InsertBuilder } from "@knex/core";
import { GrammarSqlite3 } from "./GrammarSqlite3";

export class SelectBuilderOracle extends SelectBuilder {
  dialect = Enums.DialectEnum.SQLITE3;
  protected grammar = new GrammarSqlite3();
}

export class DeleteBuilderOracle extends DeleteBuilder {
  dialect = Enums.DialectEnum.SQLITE3;
  protected grammar = new GrammarSqlite3();
}

export class UpdateBuilderOracle extends UpdateBuilder {
  dialect = Enums.DialectEnum.SQLITE3;
  protected grammar = new GrammarSqlite3();
}

export class InsertBuilderOracle extends InsertBuilder {
  dialect = Enums.DialectEnum.SQLITE3;
  protected grammar = new GrammarSqlite3();
}
