import { Grammar } from "./Grammar";
import { SubQueryNode } from "./data/structs";
import { SubQueryArg } from "./data/types";
import { SelectBuilder } from "./SelectBuilder";

export class ViewBuilder {
  protected grammar = new Grammar();

  protected selectBuilder() {
    return new SelectBuilder();
  }

  protected subQuery(fn: SubQueryArg) {
    const builder = this.selectBuilder();
    fn.call(builder, builder);
    return SubQueryNode({ ast: builder.getAst() });
  }
}
