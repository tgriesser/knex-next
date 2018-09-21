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
    Object.defineProperty(ClassToDecorate.prototype, key, {
      configurable: true,
      value() {
        if (!this.connection) {
          this.warn(
            new Error(
              `Cannot call EventEmitter property ${key} on class ${
                this.constructor.name
              } before a connection is provided. This call will be ignored.`
            )
          );
          return this;
        }
      },
    });
  });
}
