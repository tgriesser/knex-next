import { DeleteBuilder } from "../DeleteBuilder";
import { WhereClauseBuilder } from "../clauses/WhereClauseBuilder";

export function commonDeleteTests(del: () => DeleteBuilder) {
  function snap(b: DeleteBuilder) {
    expect(b.getAst()).toMatchSnapshot();
    expect(b.toOperation()).toMatchSnapshot();
  }

  test("Delete has where builder methods", () => {
    expect(del()).toBeInstanceOf(WhereClauseBuilder);
  });

  test("from table", () => {
    snap(del().from("someTable"));
  });

  test("from table where", () => {
    snap(
      del()
        .from("someTable")
        .where("id", 1)
        .orWhere({ foo: 2, bar: 3 })
    );
  });

  test(".then() executes", () => {
    del()
      .from("someTable")
      .where("id", 1);
  });
}
