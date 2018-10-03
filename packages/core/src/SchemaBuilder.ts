import { CreateTableBuilder, CreateTableColumnBlockFn, AlterTableColumnBlockFn } from "./CreateTableBuilder";
import { AlterTableBuilder } from "./AlterTableBuilder";

export class SchemaBuilder {
  with() {
    //
  }

  withSchema() {
    //
  }

  createTable(table: string, createTableBlock: CreateTableColumnBlockFn) {
    return new CreateTableBuilder().table(table).columns(createTableBlock);
  }

  createTableIfNotExists(table: string, createTableBlock: CreateTableColumnBlockFn) {
    return this.createTable(table, createTableBlock).ifNotExists();
  }

  renameTable(fromTable: string, toTable: string) {
    return new AlterTableBuilder().renameTable(fromTable, toTable);
  }

  dropTable(table: string) {
    return new AlterTableBuilder().dropTable(table);
  }

  alterTable(table: string, alterTableBlock?: AlterTableColumnBlockFn) {
    if (arguments.length === 1) {
      return new AlterTableBuilder();
    }
  }

  renameColumn(table: string, fromColumn: string, toColumn: string) {
    return new AlterTableBuilder().renameColumn(table, fromColumn, toColumn);
  }
}

export class ColumnBuilder {}
