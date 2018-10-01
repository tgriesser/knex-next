import { UpdateBuilder } from "../UpdateBuilder";
import { WhereClauseBuilder } from "../clauses/WhereClauseBuilder";

export function commonUpdateTests(update: () => UpdateBuilder) {
  function snap(b: UpdateBuilder) {
    expect(b.getAst()).toMatchSnapshot();
    expect(b.toOperation()).toMatchSnapshot();
  }

  test("Update has where builder methods", () => {
    expect(update()).toBeInstanceOf(WhereClauseBuilder);
  });

  test('update().table("tableName").set(key, value)', () => {
    snap(
      update()
        .table("tableName")
        .set("key", 1)
    );
  });

  test('update().table("tableName").set({key: value})', () => {
    snap(
      update()
        .table("tableName")
        .set({ key: 1 })
    );
  });

  test("skips undefined keys", () => {
    snap(
      update()
        .table("foo")
        // @ts-ignore
        .set({ key: 1, bar: undefined })
    );
  });
}
