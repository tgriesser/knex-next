import { Grammar, SchemaGrammar, Types, Enums } from "@knex/core";

export class GrammarPostgresql extends Grammar {
  escapeIdFragment(frag: string) {
    return `"${frag}"`;
  }

  getBinding(index: number) {
    return `$${index}`;
  }

  buildTruncate(node: Types.TTruncateOperation) {
    super.buildTruncate(node);
    this.addKeyword(" RESTART IDENTITY");
  }

  buildInsert(node: Types.TInsertOperation) {
    super.buildInsert(node);
    this.addReturning(node);
  }

  addReturning(node: Types.TOperationAst) {}
}

export class SchemaGrammarPostgresql extends SchemaGrammar {
  addBigIncrements() {
    this.addKeyword("BIGSERIAL PRIMARY KEY");
  }

  addColumnType(type: Types.TTableColumnDefinitionNode) {
    switch (type.dataType) {
      case Enums.ColumnTypeEnum.BIG_INTEGER:
        return this.addKeyword("BIGINT");
      case Enums.ColumnTypeEnum.BINARY:
        return this.addKeyword("BYTEA");
      case Enums.ColumnTypeEnum.BIT:
        return this.addKeyword("BIT(...)");
    }
    super.addColumnType(type);
  }
}
