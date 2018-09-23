import { WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { ChainFnDelete, SubQueryArg } from "./data/types";
export declare class DeleteBuilder extends WhereClauseBuilder {
    protected ast: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IDeleteOperation>;
    constructor(ast?: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IDeleteOperation>);
    from(tableName: string): this;
    getAst(): import("immutable").RecordOf<import("@knex/core/src/data/datatypes").IDeleteOperation>;
    subQuery(fn: SubQueryArg): import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ISubQuery>;
    toOperation(): import("@knex/core/src/Grammar").ToSQLValue;
    protected chain(fn: ChainFnDelete): this;
}
