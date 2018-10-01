import { InsertBuilder } from "../InsertBuilder";

export function commonInsertTests(insert: () => InsertBuilder) {
  function snap(b: InsertBuilder) {
    expect(b.getAst()).toMatchSnapshot();
    expect(b.toOperation()).toMatchSnapshot();
  }

  test("insert: values", () => {
    snap(insert().into("some_table"));
  });

  test("insert: select", () => {
    snap(
      insert()
        .into("someTable")
        .columns("a")
        .select(qb => {
          qb.select("a").from("otherTable");
        })
    );
  });

  test("multiple inserts", () => {
    snap(
      insert()
        .into("users")
        .values([{ email: "foo", name: "tim" }, { name: "kb", email: "bar" }])
    );
  });
}
