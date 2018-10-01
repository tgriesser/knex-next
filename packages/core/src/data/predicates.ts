import { Record } from "immutable";
import { TRawNode, TSubQueryNode, INode } from "./types";
import { NodeTypeEnum } from "./enums";
import { SelectBuilder } from "../SelectBuilder";
import { SELECT_BUILDER } from "./symbols";

export function isSelectBuilder(obj: any): obj is SelectBuilder {
  return typeof obj === "object" && obj !== null && obj[SELECT_BUILDER] === true;
}

export function isRawNode<T>(obj: any): obj is TRawNode {
  return Record.isRecord(obj) && obj.get("__typename") === NodeTypeEnum.RAW;
}

export function isSubQueryNode(obj: any): obj is TSubQueryNode {
  return typeof obj === "object" && obj !== null && obj.__typename === NodeTypeEnum.SUB_QUERY;
}

export function isNodeOf<N extends NodeTypeEnum>(obj: any, type: N): obj is INode<N> {
  return typeof obj === "object" && obj !== null && obj.__typename === type;
}
