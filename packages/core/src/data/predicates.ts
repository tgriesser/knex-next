import { Record } from "immutable";
import { TRawNode } from "./types";
import { NodeTypeEnum } from "./enums";
import { SelectBuilder } from "../SelectBuilder";
import { SELECT_BUILDER } from "./symbols";

export function isRawNode<T>(obj: any): obj is TRawNode {
  return Record.isRecord(obj) && obj.get("__typename") === NodeTypeEnum.RAW;
}

export function isSelectBuilder(obj: any): obj is SelectBuilder {
  return typeof obj === "object" && obj !== null && obj[SELECT_BUILDER] === true;
}
