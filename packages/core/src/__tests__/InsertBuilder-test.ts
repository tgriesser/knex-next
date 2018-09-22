import { InsertBuilder } from "../InsertBuilder";

function insert() {
  return new InsertBuilder();
}
function expectOp(obj: InsertBuilder) {
  return expect(obj.toOperation());
}

test("insert: values", () => {
  expectOp(insert().into("some_table")).toMatchInlineSnapshot(`
Object {
  "fragments": Array [
    "INSERT INTO some_table",
  ],
  "query": "INSERT INTO some_table",
  "sql": "INSERT INTO some_table",
  "values": Array [],
}
`);
});

test("insert: select", () => {
  const query = insert()
    .into("someTable")
    .select(qb => {
      qb.select("a").from("otherTable");
    });
  expectOp(query).toMatchSnapshot();
});