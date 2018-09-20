import {
  TSelectOperation,
  TDeleteOperation,
  TUpdateOperation,
  TInsertOperation,
  TRawNode,
  OperatorEnum,
  TWhereNode,
} from "./datatypes";
import { SelectBuilder } from "./SelectBuilder";
import { TableModel } from "./TableModel";

export interface ChainFn<T> {
  (ast: T): T;
}

export interface ChainFnSelect extends ChainFn<TSelectOperation> {}

export interface ChainFnDelete extends ChainFn<TDeleteOperation> {}

export interface ChainFnUpdate extends ChainFn<TUpdateOperation> {}

export interface ChainFnInsert extends ChainFn<TInsertOperation> {}

export interface ChainFnWhere extends ChainFn<TWhereNode> {}

export interface SubQuery {
  <T extends SelectBuilder>(qb: T): T;
}

export type TColumnArg = string | SubQuery | SelectBuilder | TRawNode;

export type TSelectArg = TColumnArg | TColumnArg[];

export type TTableArg = string | SubQuery | TableModel | TRawNode;

export type TUnionArg = SubQuery | SelectBuilder | TRawNode;

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
