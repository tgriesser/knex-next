import { SelectBuilder } from "../SelectBuilder";
import { sql as raw } from "../sqlTag";

function builder() {
  return new SelectBuilder();
}
function expectAst(b: SelectBuilder) {
  return expect(b.getAst());
}
function expectOp(b: SelectBuilder) {
  return expect(b.toOperation());
}

test("select columns", () => {
  const query = builder().select("a", "b");
  expectAst(query).toMatchSnapshot();
  expectOp(query).toMatchInlineSnapshot(`
Object {
  "fragments": Array [
    "SELECT a, b",
  ],
  "query": "SELECT a, b",
  "sql": "SELECT a, b",
  "values": Array [],
}
`);
});

test("select columns, with builder", () => {
  const query = builder().select("a", "b", builder().select("c"));
  expectAst(query).toMatchSnapshot();
  expectOp(query).toMatchInlineSnapshot(`
Object {
  "fragments": Array [
    "SELECT a, b,",
  ],
  "query": "SELECT a, b,",
  "sql": "SELECT a, b,",
  "values": Array [],
}
`);
});

test("select columns, with raw", () => {
  const query = builder().select("a", "b", raw`COUNT(*) as cnt`);
  expectAst(query).toMatchSnapshot();
  expectOp(query).toMatchInlineSnapshot(`
Object {
  "fragments": Array [
    "SELECT a, b, COUNT(*) as cnt",
  ],
  "query": "SELECT a, b, COUNT(*) as cnt",
  "sql": "SELECT a, b, COUNT(*) as cnt",
  "values": Array [],
}
`);
});

test("select from table", () => {
  const query = builder()
    .select("a", "b")
    .from("users");
  expectAst(query).toMatchSnapshot();
  expectOp(query).toMatchInlineSnapshot(`
Object {
  "fragments": Array [
    "SELECT a, b FROM users",
  ],
  "query": "SELECT a, b FROM users",
  "sql": "SELECT a, b FROM users",
  "values": Array [],
}
`);
});

test("where clause", () => {
  const query = builder()
    .from("users")
    .where("id", 1);
  expectAst(query).toMatchSnapshot();
  expectOp(query).toMatchInlineSnapshot(`
Object {
  "fragments": Array [
    "SELECT * FROM users WHERE id = ",
    "",
  ],
  "query": "SELECT * FROM users WHERE id = ?",
  "sql": "SELECT * FROM users WHERE id = 1",
  "values": Array [
    1,
  ],
}
`);
});

test("where subquery", () => {
  let query = builder()
    .from("users")
    .where(q => {
      q.where("id", 1).andWhere("id", 2);
    })
    .orWhere("id", 4);
  expectAst(query).toMatchSnapshot();
  expectOp(query).toMatchInlineSnapshot(`
Object {
  "fragments": Array [
    "SELECT * FROM users WHERE (id = ",
    " AND id = ",
    ") OR id = ",
    "",
  ],
  "query": "SELECT * FROM users WHERE (id = ? AND id = ?) OR id = ?",
  "sql": "SELECT * FROM users WHERE (id = 1 AND id = 2) OR id = 4",
  "values": Array [
    1,
    2,
    4,
  ],
}
`);
});
