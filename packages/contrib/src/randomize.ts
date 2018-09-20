import { BaseSelectBuilder } from "@knex/core";

export function randomize(BuilderClass: typeof BaseSelectBuilder) {
  Object.assign(BuilderClass.prototype, {
    inRandomOrder(this: BaseSelectBuilder): BaseSelectBuilder {
      return this.chain(ast => {
        return ast;
      });
    },
  });
}
