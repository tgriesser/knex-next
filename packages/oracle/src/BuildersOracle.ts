import { SelectBuilder, DeleteBuilder, UpdateBuilder, Enums, InsertBuilder } from "@knex/core";
import { GrammarOracle } from "./GrammarOracle";

export class SelectBuilderOracle extends SelectBuilder {
  dialect = Enums.DialectEnum.ORACLE;
  protected grammar = new GrammarOracle();
}

export class DeleteBuilderOracle extends DeleteBuilder {
  dialect = Enums.DialectEnum.ORACLE;
  protected grammar = new GrammarOracle();
  protected selectBuilder() {
    return new SelectBuilderOracle();
  }
}

export class UpdateBuilderOracle extends UpdateBuilder {
  dialect = Enums.DialectEnum.ORACLE;
  protected grammar = new GrammarOracle();
  protected selectBuilder() {
    return new SelectBuilderOracle();
  }
}

export class InsertBuilderOracle extends InsertBuilder {
  dialect = Enums.DialectEnum.ORACLE;
  protected grammar = new GrammarOracle();
  protected selectBuilder() {
    return new SelectBuilderOracle();
  }
}
