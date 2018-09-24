import { SelectBuilder } from "../SelectBuilder";
import { SubWhereBuilder } from "../clauses/WhereClauseBuilder";
import { OperatorEnum, NodeTypeEnum, ClauseTypeEnum, OperationTypeEnum, JoinTypeEnum } from "./enums";
import { JoinBuilder } from "../clauses/JoinBuilder";
import { RecordOf, List, Map as IMap } from "immutable";
import { SubHavingBuilder } from "../clauses/HavingClauseBuilder";

export type Maybe<T> = null | T;

export interface ChainFn<T> {
  (ast: T): T;
}

export type TNot = OperatorEnum.NOT | null;

export interface IJoinBuilderFn {
  (this: JoinBuilder, arg: JoinBuilder): any;
}
export interface IWrappedWhere {
  (this: SubWhereBuilder, arg: SubWhereBuilder): any;
}
export interface IWrappedHaving {
  (this: SubHavingBuilder, arg: SubHavingBuilder): any;
}

export interface ChainFnHaving extends ChainFn<any> {}

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

export type TGroupByArg = string | TRawNode;

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
  | "!!"
  | "in";

export type TColumnConditions = Array<[TColumnArg, TColumnArg] | [TColumnArg, TOperator, TColumnArg]>;
export type TValueConditions = Array<[TColumnArg, any] | [TColumnArg, TOperator, any]>;

export type TValueArg = null | number | string | Date | SelectBuilder | SubQueryArg;

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

export type WhereNodeTypes =
  | NodeTypeEnum.WHERE_EXPR
  | NodeTypeEnum.WHERE_COLUMN
  | NodeTypeEnum.WHERE_IN
  | NodeTypeEnum.WHERE_EXISTS
  | NodeTypeEnum.WHERE_NULL
  | NodeTypeEnum.WHERE_BETWEEN
  | NodeTypeEnum.WHERE_LIKE
  | NodeTypeEnum.WHERE_SUB;

export interface INode<N extends NodeTypeEnum> {
  __typename: N;
}

export interface IWhereConditionNode<N extends WhereNodeTypes> extends INode<N> {
  not: Maybe<OperatorEnum.NOT>;
  andOr: TAndOr;
}

export interface IWhereExprNode extends IWhereConditionNode<NodeTypeEnum.WHERE_EXPR> {
  column: Maybe<string>;
  operator: Maybe<string>;
  value: Maybe<any>;
}
export type TWhereExprNode = RecordOf<IWhereExprNode>;

export interface IWhereColumnNode extends IWhereConditionNode<NodeTypeEnum.WHERE_COLUMN> {
  column: Maybe<string>;
  operator: Maybe<string>;
  rightColumn: Maybe<string>;
}
export type TWhereColumnNode = RecordOf<IWhereColumnNode>;

export interface IWhereInNode extends IWhereConditionNode<NodeTypeEnum.WHERE_IN> {}
export type TWhereInNode = RecordOf<IWhereInNode>;

export interface IWhereNullNode extends IWhereConditionNode<NodeTypeEnum.WHERE_NULL> {
  column: Maybe<string>;
}
export type TWhereNullNode = RecordOf<IWhereNullNode>;

export interface IWhereExistsNode extends IWhereConditionNode<NodeTypeEnum.WHERE_EXISTS> {}
export type TWhereExistsNode = RecordOf<IWhereExistsNode>;

export interface IWhereBetweenNode extends IWhereConditionNode<NodeTypeEnum.WHERE_BETWEEN> {}
export type TWhereBetweenNode = RecordOf<IWhereBetweenNode>;
export interface IOrderByNode extends INode<NodeTypeEnum.ORDER_BY> {
  column: string | TRawNode;
  direction: "ASC" | "DESC";
}
export type TOrderByNode = RecordOf<IOrderByNode>;

export interface IUnionNode extends INode<NodeTypeEnum.UNION> {
  ast: Maybe<TRawNode | ISelectOperation>;
  all: boolean;
}
export interface IWhereSubNode extends IWhereConditionNode<NodeTypeEnum.WHERE_SUB> {
  ast: Maybe<TWhereClause>;
}
export type TWhereSubNode = RecordOf<IWhereSubNode>;

export interface IJoinNode extends INode<NodeTypeEnum.JOIN> {
  joinType: JoinTypeEnum;
  column: string | TRawNode | TSelectOperation;
}
export type TJoinNode = RecordOf<IJoinNode>;

export interface IAggregateNode extends INode<NodeTypeEnum.AGGREGATE> {
  column: string | TRawNode | TSelectOperation;
  alias: Maybe<string>;
}

export type TSelectNode = string | IAggregateNode | TSubQueryNode | TRawNode;

export type TFromNode = string | TSubQueryNode | TRawNode;

export type TWhereConditionNode =
  | TWhereExprNode
  | TWhereInNode
  | TWhereBetweenNode
  | TWhereSubNode
  | TWhereExistsNode
  | TWhereColumnNode;

export interface IOperationNode<T> {
  __operation: T;
}

export interface ISubQuery extends INode<NodeTypeEnum.SUB_QUERY> {
  ast: Maybe<TSelectOperation>;
}
export type TSubQueryNode = RecordOf<ISubQuery>;

export interface IClause<T extends ClauseTypeEnum> {
  __clause: T;
}
export interface IWhereClauseNodes extends IClause<ClauseTypeEnum.WHERE> {
  where: List<TWhereConditionNode>;
  having: List<TWhereConditionNode>;
}
export type TWhereClause = RecordOf<IWhereClauseNodes>;

export interface IRawNode extends INode<NodeTypeEnum.RAW> {
  fragments: List<string>;
  bindings: List<any>;
}
export type TRawNode = RecordOf<IRawNode>;

export type NumOrRaw = number | TRawNode;

export interface ISelectOperation {
  __operation: OperationTypeEnum.SELECT;
  select: List<TSelectNode>;
  from: Maybe<TFromNode>;
  join: List<TJoinNode | TRawNode>;
  order: List<TOrderByNode>;
  group: List<string | TRawNode>;
  union: List<IUnionNode>;
  limit: Maybe<NumOrRaw>;
  where: List<TWhereConditionNode>;
  having: List<TWhereConditionNode>;
  offset: Maybe<NumOrRaw>;
  distinct: boolean;
  alias: Maybe<string | TRawNode>;
  lock: Maybe<boolean | string>;
  meta: IMap<string, any>;
}
export type TSelectOperation = RecordOf<ISelectOperation>;

export interface IInsertOperation extends IOperationNode<OperationTypeEnum.INSERT> {
  __operation: OperationTypeEnum.INSERT;
  table: Maybe<string>;
  chunkSize: Maybe<number>;
  values: List<any>;
  columns: List<string>;
  select: Maybe<TSelectOperation>;
  meta: IMap<string, any>;
}
export type TInsertOperation = RecordOf<IInsertOperation>;

export interface IUpdateOperation extends IOperationNode<OperationTypeEnum.UPDATE> {
  __operation: OperationTypeEnum.UPDATE;
  table: string;
  join: List<TJoinNode | TRawNode>;
  values: List<object>;
  meta: IMap<string, any>;
}
export type TUpdateOperation = RecordOf<IUpdateOperation>;

export interface IDeleteOperation extends IOperationNode<OperationTypeEnum.DELETE> {
  table: string;
  where: List<TWhereConditionNode>;
  meta: IMap<string, any>;
}
export type TDeleteOperation = RecordOf<IDeleteOperation>;

export interface ITruncateOperation extends IOperationNode<OperationTypeEnum.TRUNCATE> {
  table: Maybe<string>;
}
export type TTruncateOperation = RecordOf<ITruncateOperation>;

export interface ICreateTableOperation extends IOperationNode<OperationTypeEnum.CREATE_TABLE> {
  table: string;
  columns: List<TCreateTableColumnNode>;
}
export type TCreateTableOperation = RecordOf<ICreateTableOperation>;

export interface IAlterTableOperation extends IOperationNode<OperationTypeEnum.ALTER_TABLE> {
  table: string;
}

export interface ICreateTableColumnNode {
  dataType: Maybe<ColumnDataType>;
}
export type TCreateTableColumnNode = RecordOf<ICreateTableColumnNode>;

export type TOperationAst =
  | TSelectOperation
  | TUpdateOperation
  | TDeleteOperation
  | TInsertOperation
  | TTruncateOperation;

export type TClauseAst = TWhereClause;

export interface IBindingNode extends INode<NodeTypeEnum.BINDING> {
  name: string;
  type: Maybe<string>;
}
