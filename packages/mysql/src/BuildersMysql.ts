import { SelectBuilder, DeleteBuilder, UpdateBuilder, Enums, InsertBuilder } from "@knex/core";
import { GrammarMysql } from "./GrammarMysql";

export class SelectBuilderMysql extends SelectBuilder {
  dialect = Enums.DialectEnum.MYSQL;
  protected grammar = new GrammarMysql();
}

export class DeleteBuilderMysql extends DeleteBuilder {
  dialect = Enums.DialectEnum.MYSQL;
  protected grammar = new GrammarMysql();
  protected selectBuilder() {
    return new SelectBuilderMysql();
  }
}

export class UpdateBuilderMysql extends UpdateBuilder {
  dialect = Enums.DialectEnum.MYSQL;
  protected grammar = new GrammarMysql();
  protected selectBuilder() {
    return new SelectBuilderMysql();
  }
}

export class InsertBuilderMysql extends InsertBuilder {
  dialect = Enums.DialectEnum.MYSQL;
  protected grammar = new GrammarMysql();
  protected selectBuilder() {
    return new SelectBuilderMysql();
  }
}
