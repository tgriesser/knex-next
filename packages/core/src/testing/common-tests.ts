import { SelectBuilder } from "../SelectBuilder";
import { raw } from "../rawTag";

interface SelectBuilderFactory {
  (): SelectBuilder;
}

export function commonTests(builder: SelectBuilderFactory) {
  function expectAst(b: SelectBuilder) {
    return expect(b.getAst());
  }
  function expectOp(b: SelectBuilder) {
    return expect(b.toOperation());
  }

  test("select columns", () => {
    const query = builder().select("a", "b");
    expectAst(query).toMatchSnapshot();
    expectOp(query).toMatchSnapshot();
  });

  test("select columns, with builder", () => {
    const query = builder().select(
      "a",
      "b",
      builder()
        .select("c")
        .as("sub")
    );
    expectAst(query).toMatchSnapshot();
    expectOp(query).toMatchSnapshot();
  });

  test("select columns, with raw", () => {
    const query = builder().select("a", "b", raw`COUNT(*) as cnt`);
    expectAst(query).toMatchSnapshot();
    expectOp(query).toMatchSnapshot();
  });

  test("select from table", () => {
    const query = builder()
      .select("a", "b")
      .from("users");
    expectAst(query).toMatchSnapshot();
    expectOp(query).toMatchSnapshot();
  });

  test("where clause", () => {
    const query = builder()
      .from("users")
      .where("id", 1);
    expectAst(query).toMatchSnapshot();
    expectOp(query).toMatchSnapshot();
  });

  test("where subquery", () => {
    let query = builder()
      .from("users")
      .where(q => {
        q.where("id", 1).andWhere("id", 2);
      })
      .orWhere("id", 4);
    expectAst(query).toMatchSnapshot();
    expectOp(query).toMatchSnapshot();
  });
}
