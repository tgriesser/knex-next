import { Grammar, Structs, Types, SchemaGrammar, Enums } from "@knex/core";
import sqlstring from "sqlstring";

export class GrammarMysql extends Grammar {
  escapeIdFragment(id: string) {
    return sqlstring.escapeId(id);
  }
  escapeValue(val: any) {
    return sqlstring.escape(val);
  }
  buildUpdate(ast: Types.TUpdateOperation) {
    if (ast === Structs.updateAst) {
      return;
    }
    this.addKeyword("UPDATE ");
    this.currentFragment += this.escapeId(ast.table);
    this.addJoinClauses(ast.join);
  }
}

export class SchemaGrammarMysql extends SchemaGrammar {
  addIncrements() {
    this.addKeyword("INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY");
  }
  addBigIncrements() {
    this.addKeyword("BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY");
  }
  addColumnDefault(type: Types.TTableColumnDefinitionNode) {
    switch (type.dataType) {
      case Enums.ColumnTypeEnum.BLOB:
      case Enums.ColumnTypeEnum.TEXT:
      case Enums.ColumnTypeEnum.MEDIUMTEXT:
      case Enums.ColumnTypeEnum.LONGTEXT:
        return;
    }
    super.addColumnDefault(type);
  }
}
