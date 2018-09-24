import { Record } from "immutable";
import { TRawNode } from "./types";
import { NodeTypeEnum } from "./enums";

export function isRawNode<T>(obj: any): obj is TRawNode {
  return Record.isRecord(obj) && obj.get("__typename") === NodeTypeEnum.RAW;
}
