import Immutable from "immutable";
import { Grammar } from "../Grammar";
import { DialectEnum } from "../data/enums";

export interface Buildable {
  /**
   * The dialect of the builder, exposed publicly if multi-dialect
   * consumers need to follow separate code paths for equivalent behavior,
   * e.g. to call
   */
  dialect: null | DialectEnum;
  /**
   * The dialect specific grammar associated with the dialect defined above.
   * A generic base grammar is supplied for the core builder, which other
   * dialects inherit.
   */
  grammar: Grammar;
  /**
   * Returns the internal AST of the builder. This property is immutable,
   * making it simple to clone and compose query fragments in different contexts.
   */
  getAst(): Immutable.Record<any>;
}
