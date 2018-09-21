import { Record } from "immutable";
import { TRawNode, NodeTypeEnum } from "./datatypes";
import { SelectBuilder } from "../SelectBuilder";

export function isRawNode<T>(obj: any): obj is TRawNode {
  return Record.isRecord(obj) && obj.get("__typename") === NodeTypeEnum.RAW;
}

export function isSelectBuilder<T>(obj: any): obj is SelectBuilder {
  return obj instanceof SelectBuilder;
}
