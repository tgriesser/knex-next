import { Types, Enums } from "./data";
import { List } from "immutable";
import { Grammar } from "./Grammar";

export class SchemaGrammar extends Grammar {
  columnTypeMap = new Map();

  buildSchemaOperation(operationAst: Types.TSchemaOperationAst) {
    switch (operationAst.__schemaOperation) {
      case Enums.SchemaOperationTypeEnum.CREATE_TABLE:
        this.buildCreateTable(operationAst);
        break;
      case Enums.SchemaOperationTypeEnum.RENAME_TABLE:
        this.buildRenameTable(operationAst);
        break;
      case Enums.SchemaOperationTypeEnum.DROP_TABLE:
        this.buildDropTable(operationAst);
        break;
      case Enums.SchemaOperationTypeEnum.ADD_COLUMN:
        this.buildAddColumn(operationAst);
        break;
      case Enums.SchemaOperationTypeEnum.DROP_COLUMN:
        this.buildDropColumn(operationAst);
        break;
      case Enums.SchemaOperationTypeEnum.MODIFY_COLUMN:
        this.buildModifyColumn(operationAst);
        break;
      case Enums.SchemaOperationTypeEnum.ADD_INDEX:
        this.buildAddIndex(operationAst);
        break;
    }
  }

  buildCreateTable(ast: Types.TCreateTableOperation) {
    this.addKeyword("CREATE TABLE ");
    this.addIdentifier(ast.table);
    if (ast.ifNotExists) {
      this.addKeyword(" IF NOT EXISTS");
    }
  }

  buildRenameTable(ast: Types.TRenameTableOperation) {
    this.addKeyword("RENAME TABLE ");
    this.addIdentifier(ast.from);
    this.addKeyword(" TO ");
    this.addIdentifier(ast.to);
  }

  buildDropTable(ast: Types.TDropTableOperation) {
    this.addKeyword("DROP TABLE ");
    this.addIdentifier(ast.table);
    if (ast.ifExists) {
      this.addKeyword(" IF EXISTS");
    }
  }

  buildAddColumn(ast: Types.TAddColumnOperation) {
    if (!ast.column) {
      return;
    }
    this.addKeyword("ALTER TABLE ");
    this.addIdentifier(ast.table);
    this.addKeyword(" ADD COLUMN ");
    this.addColumnDefinition(ast.column);
  }

  buildDropColumn(ast: Types.TDropColumnOperation) {
    this.addKeyword("ALTER TABLE ");
    this.addIdentifier(ast.table);
    this.addKeyword(" DROP COLUMN ");
    this.addKeyword(ast.column);
  }

  buildModifyColumn(ast: Types.TModifyColumnOperation) {
    //
  }

  buildAddIndex(ast: Types.TAddIndexOperation) {
    this.addKeyword("CREATE ");
    if (ast.indexType) {
    }
    this.addIdentifier(ast.table);
    this.addKeyword(" ADD INDEX ");
  }

  addColumnDefinition(ast: Types.TTableColumnDefinitionNode) {
    this.addIdentifier(ast.columnName);
    this.addSpace();
    this.addColumnType(ast);
    this.addSpace();
    this.addColumnDefault(ast);
  }

  addColumnType({ dataType }: Types.TTableColumnDefinitionNode) {
    switch (dataType) {
      case Enums.ColumnTypeEnum.INCREMENTS:
        return this.addIncrements();
      case Enums.ColumnTypeEnum.BIG_INCREMENTS:
        return this.addBigIncrements();
      case Enums.ColumnTypeEnum.INTEGER:
      case Enums.ColumnTypeEnum.SMALLINT:
      case Enums.ColumnTypeEnum.MEDIUMINT:
        return this.addKeyword("INTEGER");
      case Enums.ColumnTypeEnum.BIG_INTEGER:
        return this.addKeyword("BIGINT");
      case Enums.ColumnTypeEnum.VARCHAR:
        return this.addKeyword(`VARCHAR(...)`);
      case Enums.ColumnTypeEnum.MEDIUMTEXT:
      case Enums.ColumnTypeEnum.LONGTEXT:
      case Enums.ColumnTypeEnum.TEXT:
        return this.addKeyword("TEXT");
      case Enums.ColumnTypeEnum.TINYINT:
        return this.addKeyword("TINYINT");
      case Enums.ColumnTypeEnum.FLOAT:
        return this.addKeyword(`FLOAT(...)`);
      case Enums.ColumnTypeEnum.DOUBLE:
      case Enums.ColumnTypeEnum.DECIMAL:
        return this.addKeyword(`DECIMAL(...)`);
      case Enums.ColumnTypeEnum.BLOB:
      case Enums.ColumnTypeEnum.LONGBLOB:
      case Enums.ColumnTypeEnum.BINARY:
        return this.addKeyword("BLOB");
      case Enums.ColumnTypeEnum.BOOLEAN:
        return this.addKeyword("BOOLEAN");
      case Enums.ColumnTypeEnum.DATE:
        return this.addKeyword("DATE");
      case Enums.ColumnTypeEnum.DATETIME:
        return this.addKeyword("DATETIME");
      case Enums.ColumnTypeEnum.TIME:
        return this.addKeyword("TIME");
      case Enums.ColumnTypeEnum.TIMESTAMP:
        return this.addKeyword("TIMESTAMP");
      case Enums.ColumnTypeEnum.ENUM:
        return this.addKeyword("VARCHAR");
      case Enums.ColumnTypeEnum.BIT:
      case Enums.ColumnTypeEnum.JSON:
        return this.addKeyword("TEXT");
      case Enums.ColumnTypeEnum.UUID:
        return this.addKeyword("CHAR(36)");
      default: {
        throw new Error(`No column casting defined for ${dataType}`);
      }
    }
  }

  addIncrements() {
    this.addKeyword("INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT");
  }

  addBigIncrements() {
    this.addKeyword("INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT");
  }

  addColumnDefault(type: Types.TTableColumnDefinitionNode) {
    //
  }

  toSchemaOperation(operationAst: Types.TSchemaOperationAst) {
    if (operationAst === this.lastAst) {
      return this.sqlValue();
    } else {
      this.resetState();
    }
    this.buildSchemaOperation(operationAst);
    return this.cacheSqlValue(operationAst);
  }

  toOperations(operations: List<Types.TSchemaOperationAst>): Types.ToSQLValue[] {
    return operations.map(op => this.newInstance().toSchemaOperation(op)).toArray();
  }

  toSqlArray(operations: List<Types.TSchemaOperationAst>) {
    return operations.map(op => this.newInstance().toSchemaOperation(op).sql).toArray();
  }
}
