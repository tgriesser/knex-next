import { Grammar } from "./Grammar";
import { SubQueryNode } from "./data/structs";
import { SubQueryArg } from "./data/types";
import { SelectBuilder } from "./SelectBuilder";

export class ViewBuilder {
  grammar = new Grammar();

  protected subQuery(fn: SubQueryArg) {
    const builder = new SelectBuilder();
    fn.call(builder, builder);
    return SubQueryNode({ ast: builder.getAst() });
  }
}
