import { GrammarMysql } from "../GrammarMysql";

function g() {
  return new GrammarMysql();
}

describe("GrammarMysql", () => {
  test("escapeId", () => {
    expect(g().escapeId("some.place")).toEqual("`some`.`place`");
    expect(g().escapeId("table.*")).toEqual("`table`.*");
    expect(g().escapeId("back`ticks")).toEqual("`back``ticks`");
  });
});
