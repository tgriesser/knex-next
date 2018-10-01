import { DeleteBuilder } from "./DeleteBuilder";

/**
 * The top-level Knex instance, wrapper around creating
 * the builder classes w/ a connection, so everything works seamlessly
 */
export class KnexInstance {
  select(...columns: string[]) {
    return;
  }

  where() {}

  delete() {
    return new DeleteBuilder();
  }

  del() {
    return this.delete();
  }
}
