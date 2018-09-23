import { Grammar } from "./Grammar";
import { SubQueryArg } from "./data/types";
export declare class ViewBuilder {
    grammar: Grammar;
    protected subQuery(fn: SubQueryArg): import("immutable").RecordOf<import("@knex/core/src/data/datatypes").ISubQuery>;
}
