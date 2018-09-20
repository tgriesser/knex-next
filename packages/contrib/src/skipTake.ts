import { BaseSelectBuilder } from "../../../src/SelectBuilder";

/**
 * Alias to set the "limit"/"offset" values of the query.
 */
export function skipTake(Builder: typeof BaseSelectBuilder) {
  Object.assign(Builder.prototype, {
    skip(this: BaseSelectBuilder, value: number) {
      return this.offset();
    },
    take(this: BaseSelectBuilder, value: number) {
      return this.chain(ast => {
        return ast;
      });
    },
  });
}
