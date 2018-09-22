import { SelectBuilder } from "../SelectBuilder";
import { commonTests } from "../testing/common-tests";

describe("@knex/core - selectBuilder", () => {
  commonTests(() => new SelectBuilder());
});
