import { WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { ChainFnUpdate, SubQueryArg } from "./data/types";
export declare class UpdateBuilder<T = {
    [columnName: string]: any;
}> extends WhereClauseBuilder {
    protected ast: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IUpdateOperation>;
    constructor(ast?: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IUpdateOperation>);
    table(tableName: string): void;
    set(values: T): void;
    getAst(): import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IUpdateOperation>;
    protected chain(fn: ChainFnUpdate): this;
    protected subQuery(fn: SubQueryArg): import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ISubQuery>;
}
