import { InsertBuilder } from "../InsertBuilder";
import { commonInsertTests } from "../testing/common-insert-tests";

describe("@knex/core - InsertBuilder", () => {
  commonInsertTests(() => new InsertBuilder());
});
