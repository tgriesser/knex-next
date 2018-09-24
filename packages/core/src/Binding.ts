import { BindingNode } from "./data/structs";

export type PossibleBindingTypes = "string" | "number";

/**
 * A binding acts as a placeholder for query construction.
 * It allows us to create a "partially applied" query,
 * where we can build a function which takes an object
 * matching up with the "bindingName".
 */
export function Binding(name: string, type?: PossibleBindingTypes) {
  return BindingNode({
    name,
    type,
  });
}
