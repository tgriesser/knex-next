import { BaseSelectBuilder } from "../../../src/SelectBuilder";

export function oldestLatest(Builder: typeof BaseSelectBuilder) {
  Object.assign(Builder.prototype, {
    /**
     * Add an "order by" clause for a timestamp to the query.
     *
     * @param  string  $column
     * @return this
     */
    latest(this: BaseSelectBuilder, column: string = "created_at") {
      return this.chain(ast => {
        return ast;
      });
    },
    /**
     * Add an "order by" clause for a timestamp to the query.
     *
     * @param  string  $column
     * @return this
     */
    oldest(this: BaseSelectBuilder, column: string = "created_at") {
      return this.chain(ast => {
        return ast;
      });
    },
  });
  return Builder;
}
