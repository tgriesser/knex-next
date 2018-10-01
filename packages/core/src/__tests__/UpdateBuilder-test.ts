import { commonUpdateTests } from "../testing/common-update-tests";
import { UpdateBuilder } from "../UpdateBuilder";

describe("@knex/core - UpdateBuilder", () => {
  commonUpdateTests(() => new UpdateBuilder());
});
