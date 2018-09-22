import { Record } from "immutable";
import { TRawNode, NodeTypeEnum } from "./datatypes";

export function isRawNode<T>(obj: any): obj is TRawNode {
  return Record.isRecord(obj) && obj.get("__typename") === NodeTypeEnum.RAW;
}
