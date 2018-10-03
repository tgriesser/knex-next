import { createTableAst } from "./data/structs";
import { ChainFnCreateTable } from "./data/types";
import { Enums } from "./data";

export interface CreateTableColumnBlockFn {
  (this: CreateTableInner, arg: CreateTableInner): void;
}
export interface AlterTableColumnBlockFn {
  (this: AlterTableInner, arg: AlterTableInner): void;
}

export class CreateTableBuilder {
  constructor(protected ast = createTableAst) {}

  table(table: string) {
    return this.chain(ast => ast.set("table", table));
  }

  columns(fn: CreateTableColumnBlockFn) {
    const columnBuilder = this.createColumnBuilder();
    fn.call(columnBuilder, columnBuilder);
    return this;
  }

  ifNotExists() {}

  protected createColumnBuilder() {
    return new CreateTableInner(this);
  }

  getAst() {
    return this.ast;
  }

  protected chain(fn: ChainFnCreateTable) {
    this.ast = fn(this.ast);
    return this;
  }
}

export class CreateTableInner {
  constructor(protected createTableBuilder: CreateTableBuilder) {}

  // Numeric
  tinyint(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.TINYINT, columnName);
  }
  smallint(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.SMALLINT, columnName);
  }
  mediumint(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.MEDIUMINT, columnName);
  }
  bigincrements(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.BIGINCREMENTS, columnName);
  }
  decimal(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.DECIMAL, columnName);
  }
  float(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.FLOAT, columnName);
  }
  double(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.DOUBLE, columnName);
  }
  real(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.REAL, columnName);
  }
  bit(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.BIT, columnName);
  }
  boolean(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.BOOLEAN, columnName);
  }
  serial(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.SERIAL, columnName);
  }

  // Date / Time
  date(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.DATE, columnName);
  }
  timestamp(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.TIMESTAMP, columnName);
  }
  time(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.TIME, columnName);
  }
  year(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.YEAR, columnName);
  }

  // String
  char(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.CHAR, columnName);
  }
  varchar(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.VARCHAR, columnName);
  }
  tinytext(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.TINYTEXT, columnName);
  }
  text(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.TEXT, columnName);
  }
  mediumtext(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.MEDIUMTEXT, columnName);
  }
  longtext(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.LONGTEXT, columnName);
  }
  binary(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.BINARY, columnName);
  }
  varbinary(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.VARBINARY, columnName);
  }
  tinyblob(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.TINYBLOB, columnName);
  }
  mediumblob(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.MEDIUMBLOB, columnName);
  }
  blob(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.BLOB, columnName);
  }
  longblob(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.LONGBLOB, columnName);
  }
  enum(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.ENUM, columnName);
  }
  charset(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.CHARSET, columnName);
  }

  // Increments, Aliases, and Additional
  bool(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.BOOL, columnName);
  }
  datetime(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.DATETIME, columnName);
  }
  increments(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.INCREMENTS, columnName);
  }
  integer(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.INTEGER, columnName);
  }
  biginteger(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.BIGINTEGER, columnName);
  }
  string(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.STRING, columnName);
  }
  json(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.JSON, columnName);
  }
  jsonb(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.JSONB, columnName);
  }
  uuid(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.UUID, columnName);
  }
  enu(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.ENU, columnName);
  }
  specificType(columnName: string) {
    return this.addColumnChain(Enums.ColumnTypeEnum.SPECIFICTYPE, columnName);
  }

  // Metadata:

  comment() {}

  protected addColumnChain(type: Enums.ColumnTypeEnum, columnName: string) {}
}

/**
 *
 */
export class AlterTableInner extends CreateTableInner {
  protected addColumnChain(type: Enums.ColumnTypeEnum, columnName: string) {}
}

// Add some camel-cased aliases for Backward compat

export interface CreateTableInner {
  enum: CreateTableInner["enu"];
  bigint: CreateTableInner["biginteger"];
  bigInt: CreateTableInner["biginteger"];
  bigInteger: CreateTableInner["biginteger"];
  bigIncrements: CreateTableInner["bigincrements"];
  tinyBlob: CreateTableInner["tinyblob"];
  mediumBlob: CreateTableInner["mediumblob"];
  longBlob: CreateTableInner["longblob"];
  dateTime: CreateTableInner["datetime"];
  int: CreateTableInner["integer"];
  tinyText: CreateTableInner["tinytext"];
  mediumText: CreateTableInner["mediumtext"];
  longText: CreateTableInner["longtext"];
}

CreateTableInner.prototype.enum = CreateTableInner.prototype.enu;
CreateTableInner.prototype.bigint = CreateTableInner.prototype.biginteger;
CreateTableInner.prototype.bigInt = CreateTableInner.prototype.biginteger;
CreateTableInner.prototype.bigInteger = CreateTableInner.prototype.biginteger;
CreateTableInner.prototype.bigIncrements = CreateTableInner.prototype.bigincrements;
CreateTableInner.prototype.tinyBlob = CreateTableInner.prototype.tinyblob;
CreateTableInner.prototype.mediumBlob = CreateTableInner.prototype.mediumblob;
CreateTableInner.prototype.longBlob = CreateTableInner.prototype.longblob;
CreateTableInner.prototype.dateTime = CreateTableInner.prototype.datetime;
CreateTableInner.prototype.int = CreateTableInner.prototype.integer;
CreateTableInner.prototype.tinyText = CreateTableInner.prototype.tinytext;
CreateTableInner.prototype.mediumText = CreateTableInner.prototype.mediumtext;
CreateTableInner.prototype.longText = CreateTableInner.prototype.longtext;
