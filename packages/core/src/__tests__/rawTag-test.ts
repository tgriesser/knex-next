import { raw } from "../rawTag";

test("raw tag", () => {
  expect(raw`some value`).toMatchSnapshot();
});

test("raw tag with bindings", () => {
  expect(raw`select * from tbl where id = ${1}`).toMatchSnapshot();
});
