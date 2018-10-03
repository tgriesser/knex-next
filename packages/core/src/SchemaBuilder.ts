import { CreateTableBuilder, CreateTableColumnBlockFn, AlterTableColumnBlockFn } from "./CreateTableBuilder";
import { List } from "immutable";
import { Types, Structs } from "./data";

export class SchemaBuilder {
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

  renameTable(fromTable: string, toTable: string) {
    // return this.pushOperation(Structs.(fromTable, toTable);
  }

  dropTable(table: string) {
    // return this.pushOperation(Structs.(table);
  }

  alterTable(table: string, alterTableBlock?: AlterTableColumnBlockFn) {
    // if (arguments.length === 1) {
    //   return new AlterTableBuilder();
    // }
  }

  renameColumn(table: string, fromColumn: string, toColumn: string) {
    // return new AlterTableBuilder().renameColumn(table, fromColumn, toColumn);
  }

  protected pushOperation(operation: Types.TSchemaOperationAst) {
    this.operations = this.operations.push();
    return this;
  }
}

export class ColumnBuilder {}
