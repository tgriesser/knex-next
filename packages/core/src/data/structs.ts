import {
  NodeTypeEnum,
  ClauseTypeEnum,
  OperatorEnum,
  OperationTypeEnum,
  JoinTypeEnum,
  AggregateFns,
  DateCondType,
} from "./enums";
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
  ICondDateNode,
  ICondRawNode,
  IAliasedIdentNode,
} from "./types";

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
 * WHERE Condition: expr [op] expr
 */
export const ConditionExpressionNode = IRecord<ICondExprNode>(
  {
    __typename: NodeTypeEnum.COND_EXPR,
    not: null,
    column: null,
    operator: "=",
    value: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.COND_EXPR
);

/**
 * WHERE Condition: column [op] otherColumn
 */
export const CondColumnNode = IRecord<ICondColumnNode>(
  {
    __typename: NodeTypeEnum.COND_COLUMN,
    not: null,
    column: null,
    operator: "=",
    rightColumn: null,
    andOr: OperatorEnum.AND,
  },
  NodeTypeEnum.COND_COLUMN
);

/**
 * WHERE Condition: [NOT] IN ...
 */
export const CondInNode = IRecord<ICondInNode>(
  {
    __typename: NodeTypeEnum.COND_IN,
    not: null,
    column: null,
    andOr: OperatorEnum.AND,
    value: null,
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
    query: null,
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
    column: "",
    first: null,
    second: null,
  },
  NodeTypeEnum.COND_BETWEEN
);

export const CondDateNode = IRecord<ICondDateNode>(
  {
    __typename: NodeTypeEnum.COND_DATE,
    not: null,
    andOr: OperatorEnum.AND,
    type: DateCondType.DATE,
    column: null,
    operator: "=",
    value: null,
  },
  NodeTypeEnum.COND_DATE
);

/**
 * WHERE [NOT] BETWEEN
 */
export const CondRawNode = IRecord<ICondRawNode>(
  {
    __typename: NodeTypeEnum.COND_RAW,
    not: null,
    andOr: OperatorEnum.AND,
    value: null,
  },
  NodeTypeEnum.COND_RAW
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
    table: "",
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
    column: null,
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
 * ___ AS ___
 */
export const AliasedIdentNode = IRecord<IAliasedIdentNode>(
  {
    __typename: NodeTypeEnum.ALIASED,
    ident: "",
    alias: "",
  },
  NodeTypeEnum.ALIASED
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
    where: List(),
    values: IMap(),
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
    join: List(),
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
