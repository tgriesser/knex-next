import { SelectBuilder, DeleteBuilder, UpdateBuilder, Enums, InsertBuilder } from "@knex/core";
import { GrammarMssql } from "./GrammarMssql";

export class SelectBuilderMssql extends SelectBuilder {
  dialect = Enums.DialectEnum.MSSQL;
  protected grammar = new GrammarMssql();
}

export class DeleteBuilderMssql extends DeleteBuilder {
  dialect = Enums.DialectEnum.MSSQL;
  protected grammar = new GrammarMssql();
  protected selectBuilder() {
    return new SelectBuilderMssql();
  }
}

export class UpdateBuilderMssql extends UpdateBuilder {
  dialect = Enums.DialectEnum.MSSQL;
  protected grammar = new GrammarMssql();
  protected selectBuilder() {
    return new SelectBuilderMssql();
  }
}

export class InsertBuilderMssql extends InsertBuilder {
  dialect = Enums.DialectEnum.MSSQL;
  protected grammar = new GrammarMssql();
  protected selectBuilder() {
    return new SelectBuilderMssql();
  }
}
