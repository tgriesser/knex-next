import { isSelectBuilder } from "../data/predicates";
import { SelectBuilder } from "../SelectBuilder";

test("isSelectBuilder", () => {
  expect(isSelectBuilder(new SelectBuilder())).toEqual(true);
});
