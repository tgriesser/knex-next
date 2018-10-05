import { SelectBuilder, DeleteBuilder, UpdateBuilder, Enums, InsertBuilder, Mixins, SchemaBuilder } from "@knex/core";
import { GrammarPostgresql, SchemaGrammarPostgresql } from "./GrammarPostgres";

export interface SelectBuilderPostgresql extends Mixins.CTEMixin, Mixins.ReturningMixin {}

export class SelectBuilderPostgresql extends SelectBuilder {
  dialect = Enums.DialectEnum.POSTGRESQL;
  protected grammar = new GrammarPostgresql();
}
Mixins.commonTableExpressions(SelectBuilderPostgresql);
Mixins.returningMixin(SelectBuilderPostgresql);

export interface DeleteBuilderPostgresql extends Mixins.CTEMixin, Mixins.ReturningMixin {}

export class DeleteBuilderPostgresql extends DeleteBuilder {
  dialect = Enums.DialectEnum.POSTGRESQL;
  protected grammar = new GrammarPostgresql();
  protected selectBuilder() {
    return new SelectBuilderPostgresql();
  }
}
Mixins.commonTableExpressions(DeleteBuilderPostgresql);
Mixins.returningMixin(DeleteBuilderPostgresql);

export class UpdateBuilderPostgresql extends UpdateBuilder {
  dialect = Enums.DialectEnum.POSTGRESQL;
  protected grammar = new GrammarPostgresql();
  protected selectBuilder() {
    return new SelectBuilderPostgresql();
  }
}
Mixins.commonTableExpressions(DeleteBuilderPostgresql);
Mixins.returningMixin(UpdateBuilderPostgresql);

export class InsertBuilderPostgresql extends InsertBuilder {
  dialect = Enums.DialectEnum.POSTGRESQL;
  protected grammar = new GrammarPostgresql();
  protected selectBuilder() {
    return new SelectBuilderPostgresql();
  }
}
Mixins.commonTableExpressions(DeleteBuilderPostgresql);
Mixins.returningMixin(InsertBuilderPostgresql);

export class SchemaBuilderPostgresql extends SchemaBuilder {
  protected grammar = new SchemaGrammarPostgresql();
}
