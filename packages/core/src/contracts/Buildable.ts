import Immutable from "immutable";
import { Grammar } from "../Grammar";

export interface Buildable {
  grammar: Grammar;
  getAst(): Immutable.Record<any>;
}
