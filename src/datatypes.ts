import { Record as IRecord, List, RecordOf } from "immutable";
import { SubQuery } from "./types";

export type Maybe<T> = null | T;

export enum DialectEnum {
  MYSQL = "mysql",
  SQLITE = "sqlite",
  POSTGRESQL = "postgresql",
  ORACLE = "oracle",
  MSSQL = "mssql",
}

export enum JoinTypeEnum {
  INNER = "INNER",
  OUTER = "OUTER",
  LEFT_OUTER = "LEFT_OUTER",
  RIGHT_OUTER = "RIGHT_OUTER",
}

export enum OperationTypeEnum {
  SELECT = "SELECT",
  INSERT = "INSERT",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum OperatorEnum {
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
}

export enum NodeTypeEnum {
  FROM = "FromNode",
  JOIN = "JoinNode",
  WHERE = "WhereNode",
  HAVING = "HavingNode",
  ORDER = "OrderByNode",
  UNION = "UnionNode",
  SUBQUERY = "SubqueryNode",
  RAW = "RawNode",
  COLUMN_NODE = "ColumnNode",
}

export enum WhereClauseTypes {
  WHERE,
  WHERE_IN,
  WHERE_EXISTS,
  WHERE_NULL,
  WHERE_BETWEEN,
  WHERE_LIKE,
}

export interface IDialectNode<N extends NodeTypeEnum> {
  __dialect: Maybe<DialectEnum>;
  __typename: N;
}

/**
 * Column Node
 */
export interface IColumnNode extends IDialectNode<NodeTypeEnum.COLUMN_NODE> {
  value: string;
  escaped: Maybe<string>;
}
export const ColumnNode = IRecord<IColumnNode>(
  {
    __typename: NodeTypeEnum.COLUMN_NODE,
    __dialect: null,
    value: "",
    escaped: null,
  },
  "ColumnNode"
);
export type TColumnNodeRecord = RecordOf<IColumnNode>;

/**
 * From Node
 */
export interface ITableNode extends IDialectNode<NodeTypeEnum.FROM> {
  value: Maybe<string>;
}
export const TableNode = IRecord<ITableNode>(
  {
    __typename: NodeTypeEnum.FROM,
    __dialect: null,
    value: null,
  },
  "TableNode"
);
export type TTableNode = RecordOf<ITableNode>;

/**
 * Join Node
 */
export interface IJoinNode extends IDialectNode<NodeTypeEnum.JOIN> {}
export const JoinNode = IRecord<IJoinNode>(
  {
    __typename: NodeTypeEnum.JOIN,
    __dialect: null,
  },
  "JoinNode"
);
export type TJoinNode = RecordOf<IJoinNode>;

/**
 * Where Node
 */
export interface IWhereNode extends IDialectNode<NodeTypeEnum.WHERE> {}
export const WhereNode = IRecord<IWhereNode>(
  {
    __typename: NodeTypeEnum.WHERE,
    __dialect: null,
  },
  "WhereNode"
);
export type TWhereNode = RecordOf<IWhereNode>;

/**
 * Having Node
 */
export interface IHavingNode extends IDialectNode<NodeTypeEnum.HAVING> {}
export const HavingNode = IRecord<IHavingNode>(
  {
    __typename: NodeTypeEnum.HAVING,
    __dialect: null,
  },
  "HavingNode"
);
export type THavingNode = RecordOf<IHavingNode>;

/**
 * OrderBy Node
 */
export interface IOrderByNode extends IDialectNode<NodeTypeEnum.ORDER> {}
export const OrderByNode = IRecord<IOrderByNode>(
  {
    __typename: NodeTypeEnum.ORDER,
    __dialect: null,
  },
  "OrderByNode"
);
export type TOrderByNode = RecordOf<IOrderByNode>;

/**
 * Union Node
 */
export interface IUnionNode extends IDialectNode<NodeTypeEnum.UNION> {
  value: Maybe<TRawNode | ISelectOperation>;
}
export const UnionNode = IRecord<IUnionNode>(
  {
    __typename: NodeTypeEnum.UNION,
    __dialect: null,
    value: null,
  },
  "UnionNode"
);

/**
 * SubQuery Node
 */
export interface ISubQuery extends IDialectNode<NodeTypeEnum.SUBQUERY> {
  ast: Maybe<RecordOf<ISelectOperation>>;
  sql: string;
  query: string;
  values: any[];
  fragments: string[];
}
export const SubQueryNode = IRecord<ISubQuery>(
  {
    __typename: NodeTypeEnum.SUBQUERY,
    __dialect: null,
    ast: null,
    sql: "",
    query: "",
    values: [],
    fragments: [],
  },
  "SubQueryNode"
);
export type TSubQueryNode = RecordOf<ISubQuery>;

/**
 * Raw Node
 */
export interface IRawNode extends IDialectNode<NodeTypeEnum.RAW> {
  fragments: List<string>;
  bindings: List<any>;
}
export const RawNode = IRecord<IRawNode>(
  {
    __typename: NodeTypeEnum.RAW,
    __dialect: null,
    fragments: List<string>(),
    bindings: List<string | number>(),
  },
  "RawNode"
);
export type TRawNode = RecordOf<IRawNode>;

export type NumOrRaw = number | TRawNode;

export type TSelectNode = TColumnNodeRecord | TSubQueryNode | TRawNode;

export interface IOperationNode<T> {
  __dialect: Maybe<DialectEnum>;
  __operation: T;
}

export interface IWhereClauseNode {
  where: List<TWhereNode>;
}

export const WhereClauseNode = IRecord<IWhereClauseNode>(
  {
    where: List(),
  },
  "WhereClauseNode"
);

export const whereClauseNode = WhereClauseNode();

/**
 * Select Expressions:
 */
interface ISelectOperation extends IWhereClauseNode {
  __operation: OperationTypeEnum.SELECT;
  __dialect: Maybe<DialectEnum>;
  select: List<TSelectNode>;
  from: List<TTableNode>;
  join: List<TJoinNode>;
  having: List<THavingNode>;
  order: List<TOrderByNode>;
  union: List<IUnionNode>;
  limit: Maybe<NumOrRaw>;
  offset: Maybe<NumOrRaw>;
  distinct: boolean;
}
export const SelectOperation = IRecord<ISelectOperation>(
  {
    __operation: OperationTypeEnum.SELECT,
    __dialect: null,
    where: List(),
    select: List(),
    from: List(),
    join: List(),
    having: List(),
    order: List(),
    union: List(),
    limit: null,
    offset: null,
    distinct: false,
  },
  "SelectNodes"
);
export type TSelectOperation = RecordOf<ISelectOperation>;

export const selectAst = SelectOperation();

/**
 * Insert Bindings:
 */
export interface IInsertOperation
  extends IOperationNode<OperationTypeEnum.INSERT> {
  __operation: OperationTypeEnum.INSERT;
  __dialect: Maybe<DialectEnum>;
  table: Maybe<TTableNode>;
}
export const InsertOperation = IRecord<IInsertOperation>({
  __operation: OperationTypeEnum.INSERT,
  __dialect: null,
  table: null,
});
export type TInsertOperation = RecordOf<IInsertOperation>;

export const insertAst = InsertOperation();

/**
 * Update Bindings:
 */
export interface IUpdateOperation
  extends IOperationNode<OperationTypeEnum.UPDATE> {
  __operation: OperationTypeEnum.UPDATE;
  __dialect: Maybe<DialectEnum>;
}
export const UpdateOperation = IRecord<IUpdateOperation>({
  __operation: OperationTypeEnum.UPDATE,
  __dialect: null,
});
export type TUpdateOperation = RecordOf<IUpdateOperation>;

export const updateAst = UpdateOperation();

/**
 * Delete Bindings:
 */
export interface IDeleteOperation
  extends IOperationNode<OperationTypeEnum.DELETE> {}
export const DeleteBindings = IRecord<IDeleteOperation>({
  __operation: OperationTypeEnum.DELETE,
  __dialect: null,
});
export type TDeleteOperation = RecordOf<IDeleteOperation>;

export const deleteAst = DeleteBindings();

export type TOperationAst =
  | TSelectOperation
  | TUpdateOperation
  | TDeleteOperation
  | TInsertOperation;
