import { Record as IRecord, List, Map as IMap } from "immutable";
import * as Types from "./types";
import * as Enums from "./enums";

/**
 * raw`...`
 */
export const RawNode = IRecord<Types.IRawNode>(
  {
    __typename: Enums.NodeTypeEnum.RAW,
    fragments: List<string>(),
    bindings: List<string | number>(),
  },
  Enums.NodeTypeEnum.RAW
);

/**
 * WHERE Condition: expr [op] expr
 */
export const ConditionExpressionNode = IRecord<Types.ICondExprNode>(
  {
    __typename: Enums.NodeTypeEnum.COND_EXPR,
    not: null,
    column: null,
    operator: "=",
    value: null,
    andOr: Enums.OperatorEnum.AND,
  },
  Enums.NodeTypeEnum.COND_EXPR
);

/**
 * WHERE Condition: column [op] otherColumn
 */
export const CondColumnNode = IRecord<Types.ICondColumnNode>(
  {
    __typename: Enums.NodeTypeEnum.COND_COLUMN,
    not: null,
    column: null,
    operator: "=",
    rightColumn: null,
    andOr: Enums.OperatorEnum.AND,
  },
  Enums.NodeTypeEnum.COND_COLUMN
);

/**
 * WHERE Condition: [NOT] IN ...
 */
export const CondInNode = IRecord<Types.ICondInNode>(
  {
    __typename: Enums.NodeTypeEnum.COND_IN,
    not: null,
    column: null,
    andOr: Enums.OperatorEnum.AND,
    value: null,
  },
  Enums.NodeTypeEnum.COND_IN
);

/**
 * WHERE [NOT] NULL
 */
export const CondNullNode = IRecord<Types.ICondNullNode>(
  {
    __typename: Enums.NodeTypeEnum.COND_NULL,
    not: null,
    andOr: Enums.OperatorEnum.AND,
    column: null,
  },
  Enums.NodeTypeEnum.COND_NULL
);

/**
 * WHERE [NOT] EXISTS
 */
export const CondExistsNode = IRecord<Types.ICondExistsNode>(
  {
    __typename: Enums.NodeTypeEnum.COND_EXISTS,
    not: null,
    andOr: Enums.OperatorEnum.AND,
    query: null,
  },
  Enums.NodeTypeEnum.COND_EXISTS
);

/**
 * WHERE [NOT] BETWEEN
 */
export const CondBetweenNode = IRecord<Types.ICondBetweenNode>(
  {
    __typename: Enums.NodeTypeEnum.COND_BETWEEN,
    not: null,
    andOr: Enums.OperatorEnum.AND,
    column: "",
    first: null,
    second: null,
  },
  Enums.NodeTypeEnum.COND_BETWEEN
);

export const CondDateNode = IRecord<Types.ICondDateNode>(
  {
    __typename: Enums.NodeTypeEnum.COND_DATE,
    not: null,
    andOr: Enums.OperatorEnum.AND,
    type: Enums.DateCondType.DATE,
    column: null,
    operator: "=",
    value: null,
  },
  Enums.NodeTypeEnum.COND_DATE
);

/**
 * WHERE [NOT] BETWEEN
 */
export const CondRawNode = IRecord<Types.ICondRawNode>(
  {
    __typename: Enums.NodeTypeEnum.COND_RAW,
    not: null,
    andOr: Enums.OperatorEnum.AND,
    value: null,
  },
  Enums.NodeTypeEnum.COND_RAW
);

/**
 * SUM(*), AVG(*), etc.
 */
export const AggregateNode = IRecord<Types.IAggregateNode>(
  {
    __typename: Enums.NodeTypeEnum.AGGREGATE,
    fn: Enums.AggregateFns.COUNT,
    column: "",
    alias: null,
    distinct: false,
  },
  Enums.NodeTypeEnum.AGGREGATE
);

/**
 * JOIN ...
 */
export const JoinNode = IRecord<Types.IJoinNode>(
  {
    __typename: Enums.NodeTypeEnum.JOIN,
    joinType: Enums.JoinTypeEnum.INNER,
    table: "",
    conditions: List(),
  },
  Enums.NodeTypeEnum.JOIN
);

/**
 * ORDER BY
 */
export const OrderByNode = IRecord<Types.IOrderByNode>(
  {
    __typename: Enums.NodeTypeEnum.ORDER_BY,
    column: null,
    direction: "ASC",
  },
  Enums.NodeTypeEnum.ORDER_BY
);

/**
 * ... UNION [ALL] ...
 */
export const UnionNode = IRecord<Types.IUnionNode>(
  {
    __typename: Enums.NodeTypeEnum.UNION,
    ast: null,
    all: false,
  },
  Enums.NodeTypeEnum.UNION
);

/**
 * WHERE (...)
 */
export const CondSubNode = IRecord<Types.ICondSubNode>(
  {
    __typename: Enums.NodeTypeEnum.COND_SUB,
    not: null,
    andOr: Enums.OperatorEnum.AND,
    ast: List(),
  },
  Enums.NodeTypeEnum.COND_SUB
);

/**
 * (SELECT ...) as
 */
export const SubQueryNode = IRecord<Types.ISubQuery>(
  {
    __typename: Enums.NodeTypeEnum.SUB_QUERY,
    ast: null,
  },
  Enums.NodeTypeEnum.SUB_QUERY
);

/**
 * ___ AS ___
 */
export const AliasedIdentNode = IRecord<Types.IAliasedIdentNode>(
  {
    __typename: Enums.NodeTypeEnum.ALIASED,
    ident: "",
    alias: "",
  },
  Enums.NodeTypeEnum.ALIASED
);

/**
 * Operations:
 */

/**
 * SELECT
 */
export const SelectOperationNodes = IRecord<Types.ISelectOperation>(
  {
    __operation: Enums.OperationTypeEnum.SELECT,
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
export const InsertOperation = IRecord<Types.IInsertOperation>(
  {
    __operation: Enums.OperationTypeEnum.INSERT,
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
export const UpdateOperation = IRecord<Types.IUpdateOperation>(
  {
    __operation: Enums.OperationTypeEnum.UPDATE,
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
export const DeleteBindings = IRecord<Types.IDeleteOperation>(
  {
    __operation: Enums.OperationTypeEnum.DELETE,
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
export const TruncateBindings = IRecord<Types.ITruncateOperation>(
  {
    __operation: Enums.OperationTypeEnum.TRUNCATE,
    table: null,
  },
  "TruncateOperation"
);
export const truncateAst = TruncateBindings();

/**
 * Migration AST. Having an explicit list of operations makes it possible to
 * reverse them.
 */
export const MigrationBindings = IRecord<Types.IMigrationOperation>(
  {
    __operation: Enums.OperationTypeEnum.MIGRATION,
    operations: List(),
  },
  "MigrationOperation"
);
export const migrationAst = MigrationBindings();

/**
 * CREATE TABLE
 */
export const CreateTableOperation = IRecord<Types.ICreateTableOperation>(
  {
    __operation: Enums.OperationTypeEnum.CREATE_TABLE,
    table: "",
    columns: List(),
    ifNotExists: false,
  },
  "CreateTableOperation"
);
export const createTableAst = CreateTableOperation();

/**
 * ALTER TABLE
 */
export const AlterTableOperation = IRecord<Types.IAlterTableOperation>(
  {
    __operation: Enums.OperationTypeEnum.ALTER_TABLE,
    table: "",
  },
  "AlterTableOperation"
);

/**
 * CREATE TABLE (column)
 */
export const CreateTableColumnNode = IRecord<Types.ICreateTableColumnNode>(
  {
    dataType: null,
  },
  "CreateTableColumnNode"
);

/**
 * Placeholder for a future binding value, allows precompiled queries.
 */
export const BindingNode = IRecord<Types.IBindingNode>(
  {
    __typename: Enums.NodeTypeEnum.BINDING,
    name: "",
    type: null,
  },
  Enums.NodeTypeEnum.BINDING
);
