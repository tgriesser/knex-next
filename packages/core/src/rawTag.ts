import { RawNode } from "./data/structs";
import { List } from "immutable";

export function raw(query: TemplateStringsArray, ...bindings: any[]) {
  return RawNode({
    fragments: List(query),
    bindings: List(bindings),
  });
}

export function ident() {}
