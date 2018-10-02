import { isInOrBetween, extractAlias } from "../data/regexes";

test("inOrBetween", () => {
  expect(isInOrBetween("isnt")).toEqual(null);
  expect(isInOrBetween("isnt in")).toEqual(null);
  expect(isInOrBetween("in")).toEqual(["in", undefined, "in"]);
  expect(isInOrBetween("not in")).toEqual(["not in", "not ", "in"]);
  expect(isInOrBetween("NOT IN")).toEqual(["NOT IN", "NOT ", "IN"]);
  expect(isInOrBetween("  NOT IN  ")).toEqual(["  NOT IN  ", "NOT ", "IN"]);
  expect(isInOrBetween("  noT In  ")).toEqual(["  noT In  ", "noT ", "In"]);
  expect(isInOrBetween("between")).toEqual(["between", undefined, "between"]);
  expect(isInOrBetween("not between")).toEqual(["not between", "not ", "between"]);
  expect(isInOrBetween("NOT BETWEEN")).toEqual(["NOT BETWEEN", "NOT ", "BETWEEN"]);
  expect(isInOrBetween("  NOT BETWEEN  ")).toEqual(["  NOT BETWEEN  ", "NOT ", "BETWEEN"]);
  expect(isInOrBetween("  noT BEtween  ")).toEqual(["  noT BEtween  ", "noT ", "BEtween"]);
});

test("extractAlias", () => {
  expect(extractAlias("some.column as value")).toEqual(["some.column as value", "some.column", "value"]);
  expect(extractAlias("some.column AS value")).toEqual(["some.column AS value", "some.column", "value"]);
  expect(extractAlias("  some.column AS value  ")).toEqual(["  some.column AS value  ", "some.column", "value"]);
});
