import {
  TSelectOperation,
  TDeleteOperation,
  TUpdateOperation,
  TInsertOperation,
  TRawNode,
  OperatorEnum,
  TTruncateOperation,
  TCreateTableOperation,
} from "./datatypes";
import { SelectBuilder } from "../SelectBuilder";

export type Maybe<T> = null | T;

export interface ChainFn<T> {
  (ast: T): T;
}

export interface ChainFnWhere extends ChainFn<any> {}

export interface ChainFnSelect extends ChainFn<TSelectOperation> {}

export interface ChainFnDelete extends ChainFn<TDeleteOperation> {}

export interface ChainFnUpdate extends ChainFn<TUpdateOperation> {}

export interface ChainFnInsert extends ChainFn<TInsertOperation> {}

export interface ChainFnTruncate extends ChainFn<TTruncateOperation> {}

export interface ChainFnCreateTable extends ChainFn<TCreateTableOperation> {}

export interface SubQueryArg {
  <T extends SelectBuilder>(this: T, qb: T): any;
}

export type TColumnArg = string | SubQueryArg | SelectBuilder | TRawNode;

export type TSelectArg = TColumnArg | TColumnArg[];

export type TTableArg = string | SubQueryArg | TRawNode;

export type TUnionArg = SubQueryArg | SelectBuilder | TRawNode;

export type TAndOr = OperatorEnum.AND | OperatorEnum.OR;

export type TOperator =
  | "="
  | "<"
  | ">"
  | "<="
  | ">="
  | "<>"
  | "!="
  | "like"
  | "not like"
  | "between"
  | "not between"
  | "ilike"
  | "not ilike"
  | "exists"
  | "not exist"
  | "rlike"
  | "not rlike"
  | "regexp"
  | "not regexp"
  | "&"
  | "|"
  | "^"
  | "<<"
  | ">>"
  | "~"
  | "~*"
  | "!~"
  | "!~*"
  | "#"
  | "&&"
  | "@>"
  | "<@"
  | "||"
  | "&<"
  | "&>"
  | "-|-"
  | "@@"
  | "!!";

export type TColumnConditions = Array<
  [TColumnArg, TColumnArg] | [TColumnArg, TOperator, TColumnArg]
>;
export type TValueConditions = Array<
  [TColumnArg, any] | [TColumnArg, TOperator, any]
>;

export type TValueArg = any;

export interface FromJSArg {}

export type ColumnDataType =
  | "dropColumn"
  | "dropColumns"
  | "renameColumn"
  | "increments"
  | "integer"
  | "bigInteger"
  | "text"
  | "string"
  | "float"
  | "decimal"
  | "boolean"
  | "date"
  | "dateTime"
  | "time"
  | "timestamp"
  | "timestamps"
  | "dropTimestamps"
  | "binary"
  | "enum"
  | "json"
  | "jsonb"
  | "uuid"
  | "comment"
  | "engine"
  | "charset"
  | "collate"
  | "inherits"
  | "specificType"
  | "index"
  | "dropIndex"
  | "unique"
  | "foreign"
  | "dropForeign"
  | "dropUnique"
  | "dropPrimary";

export type ColumnIndexType = "unique" | "foreign";
