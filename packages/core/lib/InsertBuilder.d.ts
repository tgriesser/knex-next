import { ChainFnInsert, SubQueryArg } from "./data/types";
import { Grammar } from "./Grammar";
import { TRawNode } from "./data/datatypes";
import { Loggable } from "./contracts/Loggable";
import { Buildable } from "./contracts/Buildable";
export declare class InsertBuilder<T = {
    [columnName: string]: any;
}> implements Loggable, Buildable {
    protected ast: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IInsertOperation>;
    readonly dialect: null;
    grammar: Grammar;
    constructor(ast?: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IInsertOperation>);
    into(tableName: string): this;
    columns(...columnName: string[]): void;
    values(toInsert: T | T[]): this;
    select(arg: SubQueryArg | TRawNode): this;
    inBatchesOf(value: number): this;
    getAst(): import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IInsertOperation>;
    toOperation(): import("@knex/core/src/Grammar").ToSQLValue;
    protected subQuery(arg: SubQueryArg): import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ISelectOperation>;
    protected chain(fn: ChainFnInsert): this;
    log(msg: string): void;
    error(err: Error): void;
    warn(warning: string | Error): void;
}
