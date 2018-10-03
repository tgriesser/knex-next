import { SchemaBuilder } from "./SchemaBuilder";
import { CreateTableColumnBlockFn, AlterTableColumnBlockFn } from "./CreateTableBuilder";
import { migrationAst } from "./data/structs";
import { AlterTableBuilder } from "./AlterTableBuilder";

export abstract class Migration {
  constructor(protected ast = migrationAst) {}

  createTable(table: string, createTableBlock: CreateTableColumnBlockFn) {
    this.addOperation(new SchemaBuilder().createTable(table, createTableBlock));
  }

  createTableIfNotExists(table: string, createTableBlock: CreateTableColumnBlockFn) {
    this.addOperation(new SchemaBuilder().createTableIfNotExists(table, createTableBlock));
  }

  renameTable(from: string, to: string) {
    this.addOperation(new AlterTableBuilder().renameTable(from, to));
  }

  dropTable(table: string) {
    this.addOperation(new AlterTableBuilder().dropTable(table));
  }

  addColumn(table: string, column: string) {
    this.addOperation(new AlterTableBuilder().addColumn());
  }

  renameColumn() {
    //
  }

  protected addOperation(op: any) {
    this.ast = this.ast.set("operations", this.ast.operations.push(op));
  }
}
