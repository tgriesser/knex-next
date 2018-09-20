import { sql } from "../sqlTag";

test("raw tag", () => {
  expect(sql`some value`).toMatchSnapshot();
});

test("raw tag with bindings", () => {
  expect(sql`select * from tbl where id = ${1}`).toMatchSnapshot();
});
