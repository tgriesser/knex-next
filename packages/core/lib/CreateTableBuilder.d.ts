import { ChainFnCreateTable } from "./data/types";
export interface ColumnBlockBuilder {
    (): void;
}
export declare class CreateTableBuilder {
    protected ast: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ICreateTableOperation>;
    constructor(ast?: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ICreateTableOperation>);
    columns(fn: ColumnBlockBuilder): this;
    ifNotExists(): void;
    protected createColumnBuilder(): CreateTableInner;
    protected chain(fn: ChainFnCreateTable): this;
}
export declare class CreateTableInner {
    protected createTableBuilder: CreateTableBuilder;
    constructor(createTableBuilder: CreateTableBuilder);
    tinyint(columnName: string): void;
    smallint(columnName: string): void;
    mediumint(columnName: string): void;
    int(columnName: string): void;
    bigint(columnName: string): void;
    decimal(columnName: string): void;
    float(columnName: string): void;
    double(columnName: string): void;
    real(columnName: string): void;
    bit(columnName: string): void;
    boolean(columnName: string): void;
    serial(columnName: string): void;
    date(columnName: string): void;
    datetime(columnName: string): void;
    timestamp(columnName: string): void;
    time(columnName: string): void;
    year(columnName: string): void;
    char(columnName: string): void;
    varchar(columnName: string): void;
    tinytext(columnName: string): void;
    tinyText(columnName: string): void;
    text(columnName: string): void;
    mediumtext(columnName: string): void;
    mediumText(columnName: string): void;
    longtext(columnName: string): void;
    longText(columnName: string): void;
    binary(columnName: string): void;
    varbinary(columnName: string): void;
    tinyblob(columnName: string): void;
    tinyBlob(columnName: string): void;
    mediumblob(columnName: string): void;
    mediumBlob(columnName: string): void;
    blob(columnName: string): void;
    longblob(columnName: string): void;
    longBlob(columnName: string): void;
    enum(columnName: string): void;
    set(columnName: string): void;
    bool(columnName: string): void;
    dateTime(columnName: string): void;
    increments(columnName: string): void;
    bigincrements(columnName: string): void;
    bigIncrements(columnName: string): void;
    integer(columnName: string): void;
    biginteger(columnName: string): void;
    bigInteger(columnName: string): void;
    string(columnName: string): void;
    json(columnName: string): void;
    jsonb(columnName: string): void;
    uuid(columnName: string): void;
    enu(columnName: string): void;
    specificType(columnName: string): void;
    comment(): void;
    protected addColumnChain(): void;
}
