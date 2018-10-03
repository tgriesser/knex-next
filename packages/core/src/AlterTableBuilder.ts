import { Mixins } from "./data";

export class AlterTableBuilder {
  constructor() {}

  /**
   * RENAME TABLE ____ TO ____
   */
  renameTable(tableName: string, newTableName: string) {
    return;
  }

  /**
   * DROP TABLE ____
   */
  dropTable(tableName: string) {
    return;
  }

  /**
   * ALTER TABLE ____ ADD COLUMN ____
   */
  addColumn() {
    //
  }

  /**
   * ALTER TABLE ____ DROP COLUMN ____
   */
  dropColumn() {
    //
  }

  /**
   * ALTER TABLE ___ RENAME COLUMN _____ TO _____
   */
  renameColumn(tableName: string, fromColumn: string, toColumn: string) {}

  /**
   * ALTER TABLE ____ CHANGE COLUMN ____
   */
  alterColumn() {
    //
  }
}

Mixins.withExecutionMethods(AlterTableBuilder);
