import { TColumnArg, TValueArg } from "./types";

export function unpackColumn(column: TColumnArg) {
  if (typeof column === "string") {
    return column;
  }
  // return ColumnNode();
}

export function unpackValue(value: TValueArg) {
  if (typeof value === "number") {
    return value;
  }
  return "";
}

export function unpackJoin() {}
