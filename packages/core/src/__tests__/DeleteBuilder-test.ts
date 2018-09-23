import { DeleteBuilder } from "../DeleteBuilder";
import { commonDeleteTests } from "../testing/common-delete-tests";

describe("@knex/core - DeleteBuilder", () => {
  commonDeleteTests(() => new DeleteBuilder());
});
