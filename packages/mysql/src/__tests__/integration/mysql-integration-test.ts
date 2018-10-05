import { createKnex } from "../..";

describe("MySQL Driver", () => {
  let knex;

  beforeAll(() => {
    knex = createKnex();
  });

  test("hello world", () => {});
});
