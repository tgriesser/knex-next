import { DeleteBuilder } from "../DeleteBuilder";

function builder() {
  return new DeleteBuilder();
}
function expectAst(builder: DeleteBuilder) {
  return expect(builder.getAst());
}

test("Delete from table", () => {});
