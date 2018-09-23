"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatypes_1 = require("./data/datatypes");
class CreateTableBuilder {
    constructor(ast = datatypes_1.createTableAst) {
        this.ast = ast;
    }
    columns(fn) {
        const columnBuilder = this.createColumnBuilder();
        fn.call(columnBuilder, columnBuilder);
        return this;
    }
    ifNotExists() { }
    createColumnBuilder() {
        return new CreateTableInner(this);
    }
    chain(fn) {
        return this;
    }
}
exports.CreateTableBuilder = CreateTableBuilder;
class CreateTableInner {
    constructor(createTableBuilder) {
        this.createTableBuilder = createTableBuilder;
    }
    // Columns:
    // Numeric
    tinyint(columnName) {
        return this.addColumnChain();
    }
    smallint(columnName) {
        return this.addColumnChain();
    }
    mediumint(columnName) {
        return this.addColumnChain();
    }
    int(columnName) {
        return this.addColumnChain();
    }
    bigint(columnName) {
        return this.addColumnChain();
    }
    decimal(columnName) {
        return this.addColumnChain();
    }
    float(columnName) {
        return this.addColumnChain();
    }
    double(columnName) {
        return this.addColumnChain();
    }
    real(columnName) {
        return this.addColumnChain();
    }
    bit(columnName) {
        return this.addColumnChain();
    }
    boolean(columnName) {
        return this.addColumnChain();
    }
    serial(columnName) {
        return this.addColumnChain();
    }
    // Date / Time
    date(columnName) {
        return this.addColumnChain();
    }
    datetime(columnName) {
        return this.addColumnChain();
    }
    timestamp(columnName) {
        return this.addColumnChain();
    }
    time(columnName) {
        return this.addColumnChain();
    }
    year(columnName) {
        return this.addColumnChain();
    }
    // String
    char(columnName) {
        return this.addColumnChain();
    }
    varchar(columnName) {
        return this.addColumnChain();
    }
    tinytext(columnName) {
        return this.addColumnChain();
    }
    tinyText(columnName) {
        return this.addColumnChain();
    }
    text(columnName) {
        return this.addColumnChain();
    }
    mediumtext(columnName) {
        return this.addColumnChain();
    }
    mediumText(columnName) {
        return this.addColumnChain();
    }
    longtext(columnName) {
        return this.addColumnChain();
    }
    longText(columnName) {
        return this.addColumnChain();
    }
    binary(columnName) {
        return this.addColumnChain();
    }
    varbinary(columnName) {
        return this.addColumnChain();
    }
    tinyblob(columnName) {
        return this.addColumnChain();
    }
    tinyBlob(columnName) {
        return this.addColumnChain();
    }
    mediumblob(columnName) {
        return this.addColumnChain();
    }
    mediumBlob(columnName) {
        return this.addColumnChain();
    }
    blob(columnName) {
        return this.addColumnChain();
    }
    longblob(columnName) {
        return this.addColumnChain();
    }
    longBlob(columnName) {
        return this.addColumnChain();
    }
    enum(columnName) {
        return this.addColumnChain();
    }
    set(columnName) {
        return this.addColumnChain();
    }
    // Increments, Aliases, and Additional
    bool(columnName) {
        return this.addColumnChain();
    }
    dateTime(columnName) {
        return this.addColumnChain();
    }
    increments(columnName) {
        return this.addColumnChain();
    }
    bigincrements(columnName) {
        return this.addColumnChain();
    }
    bigIncrements(columnName) {
        return this.addColumnChain();
    }
    integer(columnName) {
        return this.addColumnChain();
    }
    biginteger(columnName) {
        return this.addColumnChain();
    }
    bigInteger(columnName) {
        return this.addColumnChain();
    }
    string(columnName) {
        return this.addColumnChain();
    }
    json(columnName) {
        return this.addColumnChain();
    }
    jsonb(columnName) {
        return this.addColumnChain();
    }
    uuid(columnName) {
        return this.addColumnChain();
    }
    enu(columnName) {
        return this.addColumnChain();
    }
    specificType(columnName) {
        return this.addColumnChain();
    }
    // Metadata:
    comment() { }
    addColumnChain() { }
}
exports.CreateTableInner = CreateTableInner;
