import { SelectBuilder } from "../SelectBuilder";
import { DeleteBuilder } from "../DeleteBuilder";
import { UpdateBuilder } from "../UpdateBuilder";
import { InsertBuilder } from "../InsertBuilder";
declare type DecoratedClasses = typeof SelectBuilder | typeof DeleteBuilder | typeof UpdateBuilder | typeof InsertBuilder;
export declare function withEventEmitter(ClassToDecorate: DecoratedClasses): void;
export {};
