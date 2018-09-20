import { SelectBuilder } from "../SelectBuilder";
import { sql } from "../sqlTag";

function builder() {
  return new SelectBuilder();
}
function expectAst(b: SelectBuilder) {
  return expect(b.getAst());
}
function expectSql(b: SelectBuilder) {
  return expect(b.toSql());
}

test("select columns", () => {
  expectAst(builder().select("a", "b")).toMatchSnapshot();
  expectSql(builder().select("a", "b")).toMatchInlineSnapshot(`"SELECT a, b"`);
});

test("select columns, with builder", () => {
  expectAst(
    builder().select("a", "b", builder().select("c"))
  ).toMatchSnapshot();
  expectSql(builder().select("a", "b")).toMatchInlineSnapshot(`"SELECT a, b"`);
});

test("select columns, with raw", () => {
  expectAst(builder().select("a", "b", sql`COUNT(*) as cnt`)).toMatchSnapshot();
  expectSql(builder().select("a", "b")).toMatchInlineSnapshot(`"SELECT a, b"`);
});

test("select from table", () => {
  expectAst(
    builder()
      .select("a", "b")
      .from("users")
  ).toMatchSnapshot();
  expectSql(
    builder()
      .select("a", "b")
      .from("users")
  ).toMatchInlineSnapshot(`"SELECT a, b"`);
});

test("where clause", () => {
  expectAst(builder().where("user", 1)).toMatchSnapshot();
});
