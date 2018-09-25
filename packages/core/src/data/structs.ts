import { NodeTypeEnum, ClauseTypeEnum, OperatorEnum, OperationTypeEnum, JoinTypeEnum, AggregateFns } from "./enums";
import { Record as IRecord, List, Map as IMap } from "immutable";
import {
  IJoinNode,
  IRawNode,
  ISubQuery,
  ICondSubNode,
  IUnionNode,
  IOrderByNode,
  ICondBetweenNode,
  ICondExistsNode,
  ICondNullNode,
  ICondInNode,
  ICondColumnNode,
  ICondExprNode,
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
export const ConditionExpressionNode = IRecord<ICondExprNode>(
  {
    __typename: NodeTypeEnum.COND_EXPR,
    not: null,
    column: null,
    operator: null,
    value: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.COND_EXPR
);

/**
 * WHERE Condition: expr [op] column
 */
export const CondColumnNode = IRecord<ICondColumnNode>(
  {
    __typename: NodeTypeEnum.COND_COLUMN,
    not: null,
    column: null,
    operator: null,
    rightColumn: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.COND_EXPR
);

/**
 * WHERE Condition: [NOT] IN ...
 */
export const CondInNode = IRecord<ICondInNode>(
  {
    __typename: NodeTypeEnum.COND_IN,
    not: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.COND_IN
);

/**
 * WHERE [NOT] NULL
 */
export const CondNullNode = IRecord<ICondNullNode>(
  {
    __typename: NodeTypeEnum.COND_NULL,
    not: null,
    andOr: OperatorEnum.AND,
    column: null,
  },
  NodeTypeEnum.COND_NULL
);

/**
 * WHERE [NOT] EXISTS
 */
export const CondExistsNode = IRecord<ICondExistsNode>(
  {
    __typename: NodeTypeEnum.COND_EXISTS,
    not: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.COND_EXISTS
);

/**
 * WHERE [NOT] BETWEEN
 */
export const CondBetweenNode = IRecord<ICondBetweenNode>(
  {
    __typename: NodeTypeEnum.COND_BETWEEN,
    not: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.COND_BETWEEN
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
export const CondSubNode = IRecord<ICondSubNode>(
  {
    __typename: NodeTypeEnum.COND_SUB,
    not: null,
    andOr: OperatorEnum.AND,
    ast: List(),
  },
  NodeTypeEnum.COND_SUB
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
