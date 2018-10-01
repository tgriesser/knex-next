import { DeleteBuilder } from "./DeleteBuilder";
import { InsertBuilder } from "./InsertBuilder";
import { SelectBuilder } from "./SelectBuilder";
import { UpdateBuilder } from "./UpdateBuilder";
import { ArgumentType, ArgumentTypes } from "./data/types";

/**
 * The top-level Knex instance, wrapper around creating
 * the builder classes w/ a connection, so everything works seamlessly
 */
export function makeKnexInstance<T extends string>() {
  function knex(tableName: T) {
    return {
      insert(values: ArgumentType<InsertBuilder["values"]>) {
        return new InsertBuilder().into(tableName).values(values);
      },
      update(...args: ArgumentTypes<UpdateBuilder["set"]>) {
        return new UpdateBuilder().table(tableName).set(...args);
      },
      del() {
        return new DeleteBuilder();
      },
      delete() {
        return new DeleteBuilder();
      },
      where() {
        return new SelectBuilder();
      },
    };
  }

  knex.insertInto = () => {
    return new InsertBuilder().into(tableName);
  };

  knex.updateTable = () => {};

  knex.select = () => {};

  knex.where = () => {};
}
