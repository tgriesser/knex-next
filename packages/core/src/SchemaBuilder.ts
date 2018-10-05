import { CreateTableBuilder, CreateTableColumnBlockFn, AlterTableColumnBlockFn } from "./CreateTableBuilder";
import { List } from "immutable";
import { Types, Structs } from "./data";
import { SchemaGrammar } from "./SchemaGrammar";

export class SchemaBuilder {
  protected grammar = new SchemaGrammar();

  protected operations = List<Types.TSchemaOperationAst>();

  with() {
    //
  }

  withSchema() {
    //
  }

  createTable(table: string, createTableBlock: CreateTableColumnBlockFn) {
    return this.pushOperation(
      new CreateTableBuilder()
        .table(table)
        .columns(createTableBlock)
        .getAst()
    );
  }

  createTableIfNotExists(table: string, createTableBlock: CreateTableColumnBlockFn) {
    return this.pushOperation(
      new CreateTableBuilder()
        .table(table)
        .columns(createTableBlock)
        .ifNotExists()
        .getAst()
    );
  }

  // addColumn(table: string, columnName: string);

  renameTable(from: string, to: string) {
    return this.pushOperation(Structs.RenameTableNode({ from, to }));
  }

  dropTable(table: string) {
    return this.pushOperation(Structs.DropColumnNode({ table }));
  }

  alterTable(table: string, alterTableBlock?: AlterTableColumnBlockFn) {
    // if (arguments.length === 1) {
    //   return new AlterTableBuilder();
    // }
  }

  renameColumn(table: string, fromColumn: string, toColumn: string) {
    // return new AlterTableBuilder().renameColumn(table, fromColumn, toColumn);
  }

  getAst() {
    return this.operations;
  }

  toSql() {
    return this.toSqlArray().join(";\n");
  }

  toSqlArray() {
    return this.grammar.toSqlArray(this.operations);
  }

  toOperations() {
    return this.grammar.toOperations(this.operations);
  }

  protected pushOperation(operation: Types.TSchemaOperationAst) {
    this.operations = this.operations.push(operation);
    return this;
  }
}

export class ColumnBuilder {}
