import { Record as IRecord, List, RecordOf, Map as IMap } from "immutable";
import { Maybe, TAndOr } from "./types";

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

export enum ClauseTypeEnum {
  JOIN = "JoinClause",
  WHERE = "WhereClause",
  HAVING = "HavingClause",
}

export enum NodeTypeEnum {
  TABLE = "TableNode",
  JOIN = "JoinNode",
  ORDER = "OrderByNode",
  UNION = "UnionNode",
  SUB_QUERY = "SubQueryNode",
  RAW = "RawNode",
  WHERE_EXPR = "WhereExpressionNode",
  WHERE_COLUMN = "WhereColumnNode",
  WHERE_IN = "WhereInNode",
  WHERE_EXISTS = "WhereExistsNode",
  WHERE_NULL = "WhereNullNode",
  WHERE_BETWEEN = "WhereBetweenNode",
  WHERE_LIKE = "WhereLikeNode",
  WHERE_SUB = "WhereSubNode",
  HAVING_EXPR = "HavingExpressionNode",
}

type WhereNodeTypes =
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

/**
 * From Node
 */
export interface ITableNode extends INode<NodeTypeEnum.TABLE> {
  value: Maybe<string>;
}
export const TableNode = IRecord<ITableNode>(
  {
    __typename: NodeTypeEnum.TABLE,
    value: null,
  },
  NodeTypeEnum.TABLE
);
export type TTableNode = RecordOf<ITableNode>;

/**
 * Join Node
 */
export interface IJoinNode extends INode<NodeTypeEnum.JOIN> {}
export const JoinNode = IRecord<IJoinNode>(
  {
    __typename: NodeTypeEnum.JOIN,
  },
  NodeTypeEnum.JOIN
);
export type TJoinNode = RecordOf<IJoinNode>;

export interface IClause<T extends ClauseTypeEnum> {
  __clause: T;
}

/**
 * WhereClause
 */

export interface IWhereClauseNodes extends IClause<ClauseTypeEnum.WHERE> {
  where: List<TWhereNode>;
}
export type TWhereClause = RecordOf<IWhereClauseNodes>;

export const WhereClause = IRecord<IWhereClauseNodes>(
  {
    __clause: ClauseTypeEnum.WHERE,
    where: List(),
  },
  "WhereClauseNodes"
);
export const whereClauseNode = WhereClause();

export interface IWhereNodeCommon<N extends WhereNodeTypes> extends INode<N> {
  not: Maybe<OperatorEnum.NOT>;
  andOr: TAndOr;
}

/**
 * Where Expression Node
 */
export interface IWhereExprNode
  extends IWhereNodeCommon<NodeTypeEnum.WHERE_EXPR> {
  column: Maybe<string>;
  operator: Maybe<string>;
  value: Maybe<any>;
}
export const WhereExprNode = IRecord<IWhereExprNode>(
  {
    __typename: NodeTypeEnum.WHERE_EXPR,
    not: null,
    column: null,
    operator: null,
    value: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.WHERE_EXPR
);
export type TWhereExprNode = RecordOf<IWhereExprNode>;

/**
 * Where Expression Node
 */
export interface IWhereColumnNode
  extends IWhereNodeCommon<NodeTypeEnum.WHERE_COLUMN> {
  column: Maybe<string>;
  operator: Maybe<string>;
  rightColumn: Maybe<string>;
}
export const WhereColumnNode = IRecord<IWhereColumnNode>(
  {
    __typename: NodeTypeEnum.WHERE_COLUMN,
    not: null,
    column: null,
    operator: null,
    rightColumn: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.WHERE_EXPR
);
export type TWhereColumnNode = RecordOf<IWhereColumnNode>;

/**
 * WhereIn Node
 */
export interface WhereInNode extends IWhereNodeCommon<NodeTypeEnum.WHERE_IN> {}
export const WhereInNode = IRecord<WhereInNode>(
  {
    __typename: NodeTypeEnum.WHERE_IN,
    not: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.WHERE_IN
);
export type TWhereInNode = RecordOf<WhereInNode>;

/**
 * WhereIn Node
 */
export interface WhereNullNode
  extends IWhereNodeCommon<NodeTypeEnum.WHERE_NULL> {
  column: Maybe<string>;
}
export const WhereNullNode = IRecord<WhereNullNode>(
  {
    __typename: NodeTypeEnum.WHERE_NULL,
    not: null,
    andOr: OperatorEnum.AND,
    column: null,
  },
  NodeTypeEnum.WHERE_IN
);
export type TWhereNullNode = RecordOf<WhereNullNode>;

/**
 * WhereExists Node
 */
export interface WhereExistsNode
  extends IWhereNodeCommon<NodeTypeEnum.WHERE_EXISTS> {}
export const WhereExistsNode = IRecord<WhereExistsNode>(
  {
    __typename: NodeTypeEnum.WHERE_EXISTS,
    not: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.WHERE_EXISTS
);
export type TWhereExistsNode = RecordOf<WhereExistsNode>;

/**
 * WhereBetween Node
 */
export interface WhereBetweenNode
  extends IWhereNodeCommon<NodeTypeEnum.WHERE_BETWEEN> {}
export const WhereBetweenNode = IRecord<WhereBetweenNode>(
  {
    __typename: NodeTypeEnum.WHERE_BETWEEN,
    not: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.WHERE_BETWEEN
);
export type TWhereBetweenNode = RecordOf<WhereBetweenNode>;

/**
 * Having Node
 */
export interface IHavingNode extends INode<NodeTypeEnum.HAVING_EXPR> {}
export const HavingNode = IRecord<IHavingNode>(
  {
    __typename: NodeTypeEnum.HAVING_EXPR,
  },
  NodeTypeEnum.HAVING_EXPR
);
export type THavingNode = RecordOf<IHavingNode>;

/**
 * OrderBy Node
 */
export interface IOrderByNode extends INode<NodeTypeEnum.ORDER> {}
export const OrderByNode = IRecord<IOrderByNode>(
  {
    __typename: NodeTypeEnum.ORDER,
  },
  NodeTypeEnum.ORDER
);
export type TOrderByNode = RecordOf<IOrderByNode>;

/**
 * Union Node
 */
export interface IUnionNode extends INode<NodeTypeEnum.UNION> {
  ast: Maybe<TRawNode | ISelectOperation>;
}
export const UnionNode = IRecord<IUnionNode>(
  {
    __typename: NodeTypeEnum.UNION,
    ast: null,
  },
  NodeTypeEnum.UNION
);

/**
 * WhereSub Node
 */
export interface IWhereSubNode
  extends IWhereNodeCommon<NodeTypeEnum.WHERE_SUB> {
  ast: Maybe<TWhereClause>;
}

export const WhereSubNode = IRecord<IWhereSubNode>(
  {
    __typename: NodeTypeEnum.WHERE_SUB,
    not: null,
    andOr: OperatorEnum.AND,
    ast: null,
  },
  NodeTypeEnum.WHERE_SUB
);
export type TWhereSubNode = RecordOf<IWhereSubNode>;

/**
 * SubQuery Node
 */
export interface ISubQuery extends INode<NodeTypeEnum.SUB_QUERY> {
  ast: Maybe<TSelectOperation>;
}

export const SubQueryNode = IRecord<ISubQuery>(
  {
    __typename: NodeTypeEnum.SUB_QUERY,
    ast: null,
  },
  NodeTypeEnum.SUB_QUERY
);
export type TSubQueryNode = RecordOf<ISubQuery>;

/**
 * Raw Node
 */
export interface IRawNode extends INode<NodeTypeEnum.RAW> {
  fragments: List<string>;
  bindings: List<any>;
}
export const RawNode = IRecord<IRawNode>(
  {
    __typename: NodeTypeEnum.RAW,
    fragments: List<string>(),
    bindings: List<string | number>(),
  },
  NodeTypeEnum.RAW
);
export type TRawNode = RecordOf<IRawNode>;

export type NumOrRaw = number | TRawNode;

export type TSelectNode = string | TSubQueryNode | TRawNode;

export interface IOperationNode<T> {
  __operation: T;
}

export interface IHavingClauseNodes extends IClause<ClauseTypeEnum.HAVING> {
  where: List<THavingNode>;
}
export type THavingClause = RecordOf<IHavingClauseNodes>;

export const HavingClause = IRecord<IHavingClauseNodes>(
  {
    __clause: ClauseTypeEnum.HAVING,
    where: List(),
  },
  "HavingClauseNodes"
);

export const havingClauseNode = HavingClause();

/**
 * Select Expressions:
 */
interface ISelectOperation {
  __operation: OperationTypeEnum.SELECT;
  select: List<TSelectNode>;
  from: Maybe<TTableNode | TRawNode | TSubQueryNode>;
  join: List<TJoinNode>;
  having: List<THavingNode>;
  order: List<TOrderByNode>;
  union: List<IUnionNode>;
  limit: Maybe<NumOrRaw>;
  where: List<TWhereNode>;
  offset: Maybe<NumOrRaw>;
  distinct: boolean;
  alias: Maybe<TTableNode | TRawNode>;
  meta: IMap<string, any>;
}
export const SelectOperationNodes = IRecord<ISelectOperation>(
  {
    __operation: OperationTypeEnum.SELECT,
    from: null,
    where: List(),
    select: List(),
    join: List(),
    having: List(),
    order: List(),
    union: List(),
    limit: null,
    offset: null,
    alias: null,
    distinct: false,
    meta: IMap(),
  },
  "SelectNodes"
);
export type TSelectOperation = RecordOf<ISelectOperation>;

export const selectAst = SelectOperationNodes();

/**
 * Insert Bindings:
 */
export interface IInsertOperation
  extends IOperationNode<OperationTypeEnum.INSERT> {
  __operation: OperationTypeEnum.INSERT;
  table: Maybe<string>;
}
export const InsertOperation = IRecord<IInsertOperation>({
  __operation: OperationTypeEnum.INSERT,
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
}
export const UpdateOperation = IRecord<IUpdateOperation>({
  __operation: OperationTypeEnum.UPDATE,
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
});
export type TDeleteOperation = RecordOf<IDeleteOperation>;

export const deleteAst = DeleteBindings();

export type TOperationAst =
  | TSelectOperation
  | TUpdateOperation
  | TDeleteOperation
  | TInsertOperation;

export type TClauseAst = TWhereClause;

export type TWhereNode =
  | TWhereExprNode
  | TWhereInNode
  | TWhereBetweenNode
  | TWhereSubNode
  | TWhereExistsNode
  | TWhereColumnNode;
