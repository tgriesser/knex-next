import { RawNode } from "./datatypes";
import { List } from "immutable";

export function sql(query: TemplateStringsArray, ...bindings: any[]) {
  return RawNode({
    __dialect: null,
    fragments: List(query),
    bindings: List(bindings),
  });
}

export function ident() {}
