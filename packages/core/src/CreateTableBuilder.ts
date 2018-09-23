import { createTableAst } from "./data/datatypes";
import { ChainFnCreateTable } from "./data/types";

export interface ColumnBlockBuilder {
  (): void;
}

export class CreateTableBuilder {
  constructor(protected ast = createTableAst) {}

  columns(fn: ColumnBlockBuilder) {
    const columnBuilder = this.createColumnBuilder();
    fn.call(columnBuilder, columnBuilder);
    return this;
  }

  ifNotExists() {}

  protected createColumnBuilder() {
    return new CreateTableInner(this);
  }

  protected chain(fn: ChainFnCreateTable) {
    return this;
  }
}

export class CreateTableInner {
  constructor(protected createTableBuilder: CreateTableBuilder) {}

  // Columns:

  // Numeric
  tinyint(columnName: string) {
    return this.addColumnChain();
  }
  smallint(columnName: string) {
    return this.addColumnChain();
  }
  mediumint(columnName: string) {
    return this.addColumnChain();
  }
  int(columnName: string) {
    return this.addColumnChain();
  }
  bigint(columnName: string) {
    return this.addColumnChain();
  }
  decimal(columnName: string) {
    return this.addColumnChain();
  }
  float(columnName: string) {
    return this.addColumnChain();
  }
  double(columnName: string) {
    return this.addColumnChain();
  }
  real(columnName: string) {
    return this.addColumnChain();
  }
  bit(columnName: string) {
    return this.addColumnChain();
  }
  boolean(columnName: string) {
    return this.addColumnChain();
  }
  serial(columnName: string) {
    return this.addColumnChain();
  }

  // Date / Time
  date(columnName: string) {
    return this.addColumnChain();
  }
  datetime(columnName: string) {
    return this.addColumnChain();
  }
  timestamp(columnName: string) {
    return this.addColumnChain();
  }
  time(columnName: string) {
    return this.addColumnChain();
  }
  year(columnName: string) {
    return this.addColumnChain();
  }

  // String
  char(columnName: string) {
    return this.addColumnChain();
  }
  varchar(columnName: string) {
    return this.addColumnChain();
  }
  tinytext(columnName: string) {
    return this.addColumnChain();
  }
  tinyText(columnName: string) {
    return this.addColumnChain();
  }
  text(columnName: string) {
    return this.addColumnChain();
  }
  mediumtext(columnName: string) {
    return this.addColumnChain();
  }
  mediumText(columnName: string) {
    return this.addColumnChain();
  }
  longtext(columnName: string) {
    return this.addColumnChain();
  }
  longText(columnName: string) {
    return this.addColumnChain();
  }
  binary(columnName: string) {
    return this.addColumnChain();
  }
  varbinary(columnName: string) {
    return this.addColumnChain();
  }
  tinyblob(columnName: string) {
    return this.addColumnChain();
  }
  tinyBlob(columnName: string) {
    return this.addColumnChain();
  }
  mediumblob(columnName: string) {
    return this.addColumnChain();
  }
  mediumBlob(columnName: string) {
    return this.addColumnChain();
  }
  blob(columnName: string) {
    return this.addColumnChain();
  }
  longblob(columnName: string) {
    return this.addColumnChain();
  }
  longBlob(columnName: string) {
    return this.addColumnChain();
  }
  enum(columnName: string) {
    return this.addColumnChain();
  }
  set(columnName: string) {
    return this.addColumnChain();
  }

  // Increments, Aliases, and Additional
  bool(columnName: string) {
    return this.addColumnChain();
  }
  dateTime(columnName: string) {
    return this.addColumnChain();
  }
  increments(columnName: string) {
    return this.addColumnChain();
  }
  bigincrements(columnName: string) {
    return this.addColumnChain();
  }
  bigIncrements(columnName: string) {
    return this.addColumnChain();
  }
  integer(columnName: string) {
    return this.addColumnChain();
  }
  biginteger(columnName: string) {
    return this.addColumnChain();
  }
  bigInteger(columnName: string) {
    return this.addColumnChain();
  }
  string(columnName: string) {
    return this.addColumnChain();
  }
  json(columnName: string) {
    return this.addColumnChain();
  }
  jsonb(columnName: string) {
    return this.addColumnChain();
  }
  uuid(columnName: string) {
    return this.addColumnChain();
  }
  enu(columnName: string) {
    return this.addColumnChain();
  }
  specificType(columnName: string) {
    return this.addColumnChain();
  }

  // Metadata:

  comment() {}

  protected addColumnChain() {}
}
