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
  }

  addColumnType(type: Types.TTableColumnDefinitionNode) {
    this.addIdentifier(type.dataType);
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

  toOperationList(operations: List<Types.TSchemaOperationAst>): Types.ToSQLValue[] {
    return operations.map(op => this.newInstance().toSchemaOperation(op)).toArray();
  }

  toSqlList(operations: List<Types.TSchemaOperationAst>) {
    return operations.map(op => this.newInstance().toSchemaOperation(op).sql).toArray();
  }
}
