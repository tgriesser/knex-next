import { SchemaBuilder } from "./SchemaBuilder";
import { CreateTableColumnBlockFn } from "./CreateTableBuilder";
import { ColumnTypeEnum } from "./data/enums";

export abstract class Migration {
  static ColumnType = ColumnTypeEnum;

  protected builder = new SchemaBuilder();

  createTable(table: string, createTableBlock: CreateTableColumnBlockFn) {
    this.builder.createTable(table, createTableBlock);
  }

  createTableIfNotExists(table: string, createTableBlock: CreateTableColumnBlockFn) {
    this.builder.createTableIfNotExists(table, createTableBlock);
  }

  renameTable(from: string, to: string) {
    this.builder.renameTable(from, to);
  }

  dropTable(table: string) {
    this.builder.dropTable(table);
  }

  addColumn(table: string, column: string) {
    this.builder.addColumn(table, column);
  }

  renameColumn() {
    //
  }
}
