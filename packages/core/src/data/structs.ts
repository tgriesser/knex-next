import { NodeTypeEnum, ClauseTypeEnum, OperatorEnum, OperationTypeEnum, JoinTypeEnum, AggregateFns } from "./enums";
import { Record as IRecord, List, Map as IMap } from "immutable";
import {
  IJoinNode,
  IRawNode,
  ISubQuery,
  IWhereSubNode,
  IUnionNode,
  IOrderByNode,
  IWhereBetweenNode,
  IWhereExistsNode,
  IWhereNullNode,
  IWhereInNode,
  IWhereColumnNode,
  IWhereExprNode,
  IWhereClauseNodes,
  ISelectOperation,
  IInsertOperation,
  IUpdateOperation,
  IDeleteOperation,
  ITruncateOperation,
  ICreateTableOperation,
  ICreateTableColumnNode,
  IBindingNode,
  IAggregateNode,
  IAlterTableOperation,
} from "./types";

/**
 * WHERE ...
 */
export const WhereClause = IRecord<IWhereClauseNodes>(
  {
    __clause: ClauseTypeEnum.WHERE,
    where: List(),
    having: List(),
  },
  "WhereClauseNodes"
);
export const whereClauseNode = WhereClause();

/**
 * WHERE Condition: expr [op] expr
 */
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

/**
 * WHERE Condition: expr [op] column
 */
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

/**
 * WHERE Condition: [NOT] IN ...
 */
export const WhereInNode = IRecord<IWhereInNode>(
  {
    __typename: NodeTypeEnum.WHERE_IN,
    not: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.WHERE_IN
);

/**
 * WHERE [NOT] NULL
 */
export const WhereNullNode = IRecord<IWhereNullNode>(
  {
    __typename: NodeTypeEnum.WHERE_NULL,
    not: null,
    andOr: OperatorEnum.AND,
    column: null,
  },
  NodeTypeEnum.WHERE_NULL
);

/**
 * WHERE [NOT] EXISTS
 */
export const WhereExistsNode = IRecord<IWhereExistsNode>(
  {
    __typename: NodeTypeEnum.WHERE_EXISTS,
    not: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.WHERE_EXISTS
);

/**
 * WHERE [NOT] BETWEEN
 */
export const WhereBetweenNode = IRecord<IWhereBetweenNode>(
  {
    __typename: NodeTypeEnum.WHERE_BETWEEN,
    not: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.WHERE_BETWEEN
);

/**
 * SUM(*), AVG(*), etc.
 */
export const AggregateNode = IRecord<IAggregateNode>(
  {
    __typename: NodeTypeEnum.AGGREGATE,
    fn: AggregateFns.COUNT,
    column: "",
    alias: null,
    distinct: false,
  },
  NodeTypeEnum.AGGREGATE
);

/**
 * JOIN ...
 */
export const JoinNode = IRecord<IJoinNode>(
  {
    __typename: NodeTypeEnum.JOIN,
    joinType: JoinTypeEnum.INNER,
    column: "",
    conditions: List(),
  },
  NodeTypeEnum.JOIN
);

/**
 * ORDER BY
 */
export const OrderByNode = IRecord<IOrderByNode>(
  {
    __typename: NodeTypeEnum.ORDER_BY,
    column: "",
    direction: "ASC",
  },
  NodeTypeEnum.ORDER_BY
);

/**
 * ... UNION [ALL] ...
 */
export const UnionNode = IRecord<IUnionNode>(
  {
    __typename: NodeTypeEnum.UNION,
    ast: null,
    all: false,
  },
  NodeTypeEnum.UNION
);

/**
 * WHERE (...)
 */
export const WhereSubNode = IRecord<IWhereSubNode>(
  {
    __typename: NodeTypeEnum.WHERE_SUB,
    not: null,
    andOr: OperatorEnum.AND,
    ast: null,
  },
  NodeTypeEnum.WHERE_SUB
);

/**
 * (SELECT ...) as
 */
export const SubQueryNode = IRecord<ISubQuery>(
  {
    __typename: NodeTypeEnum.SUB_QUERY,
    ast: null,
  },
  NodeTypeEnum.SUB_QUERY
);

/**
 * raw`...`
 */
export const RawNode = IRecord<IRawNode>(
  {
    __typename: NodeTypeEnum.RAW,
    fragments: List<string>(),
    bindings: List<string | number>(),
  },
  NodeTypeEnum.RAW
);

/**
 * Operations:
 */

/**
 * SELECT
 */
export const SelectOperationNodes = IRecord<ISelectOperation>(
  {
    __operation: OperationTypeEnum.SELECT,
    from: null,
    where: List(),
    select: List(),
    join: List(),
    having: List(),
    group: List(),
    order: List(),
    union: List(),
    limit: null,
    offset: null,
    alias: null,
    distinct: false,
    lock: null,
    meta: IMap(),
  },
  "SelectNodes"
);
export const selectAst = SelectOperationNodes();

/**
 * INSERT
 */
export const InsertOperation = IRecord<IInsertOperation>(
  {
    __operation: OperationTypeEnum.INSERT,
    table: null,
    chunkSize: null,
    columns: List(),
    values: List(),
    select: null,
    meta: IMap(),
  },
  "InsertOperation"
);
export const insertAst = InsertOperation();

/**
 * UPDATE
 */
export const UpdateOperation = IRecord<IUpdateOperation>(
  {
    __operation: OperationTypeEnum.UPDATE,
    table: "",
    join: List(),
    values: List(),
    meta: IMap(),
  },
  "UpdateOperation"
);
export const updateAst = UpdateOperation();

/**
 * DELETE
 */
export const DeleteBindings = IRecord<IDeleteOperation>(
  {
    __operation: OperationTypeEnum.DELETE,
    table: "",
    where: List(),
    meta: IMap(),
  },
  "DeleteOperation"
);
export const deleteAst = DeleteBindings();

/**
 * TRUNCATE
 */
export const TruncateBindings = IRecord<ITruncateOperation>(
  {
    __operation: OperationTypeEnum.TRUNCATE,
    table: null,
  },
  "TruncateOperation"
);
export const truncateAst = TruncateBindings();

/**
 * CREATE TABLE
 */
export const CreateTableOperation = IRecord<ICreateTableOperation>(
  {
    __operation: OperationTypeEnum.CREATE_TABLE,
    table: "",
    columns: List(),
  },
  "CreateTableOperation"
);
export const createTableAst = CreateTableOperation();

/**
 * ALTER TABLE
 */
export const AlterTableOperation = IRecord<IAlterTableOperation>(
  {
    __operation: OperationTypeEnum.ALTER_TABLE,
    table: "",
  },
  "AlterTableOperation"
);

/**
 * CREATE TABLE (column)
 */
export const CreateTableColumnNode = IRecord<ICreateTableColumnNode>(
  {
    dataType: null,
  },
  "CreateTableColumnNode"
);

/**
 * Placeholder for a future binding value, allows precompiled queries.
 */
export const BindingNode = IRecord<IBindingNode>(
  {
    __typename: NodeTypeEnum.BINDING,
    name: "",
    type: null,
  },
  NodeTypeEnum.BINDING
);
