import { InsertBuilder } from "../InsertBuilder";

function builder() {
  return new InsertBuilder();
}
function expectOp(obj: InsertBuilder) {
  return expect(obj.toOperation());
}

test("insert into table", () => {
  expectOp(builder().insertInto("some_table")).toMatchInlineSnapshot(`
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
