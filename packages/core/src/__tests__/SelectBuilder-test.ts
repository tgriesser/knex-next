import { SelectBuilder } from "../SelectBuilder";
import { commonSelectTests } from "../testing/common-select-tests";

describe("@knex/core - SelectBuilder", () => {
  commonSelectTests(() => new SelectBuilder());
});
