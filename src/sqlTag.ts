import { RawNode } from "./data/datatypes";
import { List } from "immutable";

export function sql(query: TemplateStringsArray, ...bindings: any[]) {
  return RawNode({
    fragments: List(query),
    bindings: List(bindings),
  });
}

export function ident() {}
