import { Grammar } from "./Grammar";
import { Buildable } from "./contracts/Buildable";
import { ChainFnTruncate } from "@knex/core/src/data/types";
export declare class TruncateBuilder implements Buildable {
    protected ast: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ITruncateOperation>;
    grammar: Grammar;
    constructor(ast?: import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ITruncateOperation>);
    table(tableName: string): this;
    getAst(): import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ITruncateOperation>;
    protected chain(fn: ChainFnTruncate): this;
}
