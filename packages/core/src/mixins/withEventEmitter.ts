import { EventEmitter } from "events";
import { SelectBuilder } from "../SelectBuilder";
import { DeleteBuilder } from "../DeleteBuilder";
import { UpdateBuilder } from "../UpdateBuilder";
import { InsertBuilder } from "../InsertBuilder";

type DecoratedClasses =
  | typeof SelectBuilder
  | typeof DeleteBuilder
  | typeof UpdateBuilder
  | typeof InsertBuilder;

export function withEventEmitter(ClassToDecorate: DecoratedClasses) {
  Object.keys(EventEmitter.prototype).forEach(key => {
    // @ts-ignore
    ClassToDecorate.prototype[key] = EventEmitter.prototype[key];
  });
}
