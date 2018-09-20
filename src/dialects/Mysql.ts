import { BaseSelectBuilder } from "../SelectBuilder";
import { ChainFnSelect } from "../types";
import { Grammar } from "../Grammar";

export class MysqlGrammar extends Grammar {}

export class MysqlSelectBuilder extends BaseSelectBuilder {
  grammar = new MysqlGrammar();
  protected chain(fn: ChainFnSelect): MysqlSelectBuilder {
    this.ast = fn(this.ast);
    return this;
  }
}

export class ImmutableMysqlSelectBuilder extends BaseSelectBuilder {
  protected chain(fn: ChainFnSelect): ImmutableMysqlSelectBuilder {
    return new ImmutableMysqlSelectBuilder(fn(this.ast));
  }
}
