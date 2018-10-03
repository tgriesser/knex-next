import Immutable from "immutable";
import { SelectBuilder } from "../SelectBuilder";
import { WhereClauseBuilder } from "../clauses/WhereClauseBuilder";
import {
  OperatorEnum,
  NodeTypeEnum,
  OperationTypeEnum,
  JoinTypeEnum,
  AggregateFns,
  DateCondType,
  DialectEnum,
  SchemaOperationTypeEnum,
  IndexTypeEnum,
} from "./enums";
import { JoinBuilder } from "../clauses/JoinBuilder";
import { RecordOf, List, Map as IMap } from "immutable";
import { HavingClauseBuilder } from "../clauses/HavingClauseBuilder";
import { AddCondition } from "../clauses/AddCondition";
import { Connection } from "../Connection";
import * as Enums from "./enums";

export interface IBuilder {
  /**
   * The dialect of the builder, exposed publicly if multi-dialect
   * consumers need to follow separate code paths for equivalent behavior,
   * e.g. to call
   */
  dialect: null | DialectEnum;
  /**
   * Returns the internal AST of the builder. This property is immutable,
   * making it simple to clone and compose query fragments in different contexts.
   */
  getAst(): Immutable.Record<any>;
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type Maybe<T> = null | T;

export interface ChainFn<T> {
  (ast: T): T;
}

export type TNot = OperatorEnum.NOT | null;

export type TJoinBuilderFn = (this: JoinBuilder, arg: JoinBuilder) => void | JoinBuilder;

export type TWhereBuilderFn = (this: WhereClauseBuilder, arg: WhereClauseBuilder) => void | WhereClauseBuilder;

export type THavingBuilderFn = (this: HavingClauseBuilder, arg: HavingClauseBuilder) => void | HavingClauseBuilder;

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

export interface SubConditionFn {
  (this: AddCondition, qb: AddCondition): any;
}

/**
 * Argument for a column, what's passed into the query builder
 */
export type TColumnArg = string | number | SelectBuilder | TRawNode;

/**
 * Allow numbers in select arguments, but not elsewhere
 */
export type TSelectColumnArg = number | TColumnArg | SubQueryArg;

/**
 * Argument for a value
 */
export type TValueArg = null | number | string | Date | SelectBuilder | TRawNode;

/**
 * Argument for a select column
 */
export type TSelectArg = TAliasObj | TSelectColumnArg | TSelectColumnArg[];

/**
 * {alias: identifier} syntax
 */
export type TAliasObj = { [aliasIdent: string]: string };

/**
 * Argument for an aggregate
 */
export type TAggregateArg = string | string[] | TRawNode | SelectBuilder;

export type TTableArg = string | SubQueryArg | SelectBuilder | TRawNode;

export type TQueryArg = SubQueryArg | SelectBuilder | TRawNode;

export type TUnionArg = SubQueryArg | SelectBuilder | TRawNode;

export type TAndOr = OperatorEnum.AND | OperatorEnum.OR;

export type TGroupByArg = string | TRawNode;

export type TColumnCondition2 = [TColumnArg, TColumnArg] | [number, number];

export type TColumnCondition3 = [TColumnArg, TOperatorArg, TColumnArg] | [number, TOperatorArg, number];

export type TColumnCondition = TColumnCondition2 | TColumnCondition3;

export type TValueCondition2 = [TColumnArg, TValueArg] | [number, number];

export type TValueCondition3 = [TColumnArg, TOperatorArg, TValueArg] | [number, TOperatorArg, number];

export type TValueCondition = TValueCondition2 | TValueCondition3;

/**
 * The type for a column (or place for a column) in the AST
 */
export type TColumn = string | TAliasedIdentNode | TRawNode | TSubQueryNode;

/**
 * The type for a column in the AST
 */
export type TTable = string | TAliasedIdentNode | TRawNode | TSubQueryNode;

/**
 * Like a column, but when it's used as a value rather than aliased like in GROUP BY / ORDER BY
 * or in the right side of a column condition
 */
export type TColumnVal = string | TRawNode | TSubQueryNode;

/**
 * The type for a value in the AST
 */
export type TValue = null | string | number | Date | TRawNode | TSubQueryNode;

/**
 * All of the possible arguments to a WHERE IN clause
 */
export type TInArg = Array<any> | TRawNode | SelectBuilder | SubQueryArg;

/**
 * The type for a value in a [NOT] IN (___) AST
 */
export type TInValue = Array<any> | TRawNode | TSubQueryNode;

/**
 * All of the valid arguments for where an operator will be used.
 */
export type TOperatorArg = string | TRawNode;

export type TOrderByDirection = "asc" | "ASC" | "desc" | "DESC";

export interface FromJSArg {}

export type ColumnIndexType = "unique" | "foreign";

export type ConditionNodeTypes =
  | NodeTypeEnum.COND_EXPR
  | NodeTypeEnum.COND_COLUMN
  | NodeTypeEnum.COND_IN
  | NodeTypeEnum.COND_EXISTS
  | NodeTypeEnum.COND_NULL
  | NodeTypeEnum.COND_BETWEEN
  | NodeTypeEnum.COND_LIKE
  | NodeTypeEnum.COND_SUB
  | NodeTypeEnum.COND_DATE
  | NodeTypeEnum.COND_RAW;

export interface INode<N extends NodeTypeEnum> {
  __typename: N;
}

export interface IConditionNode<N extends ConditionNodeTypes> extends INode<N> {
  not: Maybe<OperatorEnum.NOT>;
  andOr: TAndOr;
}

export interface ICondExprNode extends IConditionNode<NodeTypeEnum.COND_EXPR> {
  column: Maybe<TColumn>;
  operator: TOperatorArg;
  value: Maybe<TValue>;
}
export type TCondExprNode = RecordOf<ICondExprNode>;

export interface ICondColumnNode extends IConditionNode<NodeTypeEnum.COND_COLUMN> {
  column: Maybe<TColumn>;
  operator: TOperatorArg;
  rightColumn: Maybe<TColumn>;
}
export type TCondColumnNode = RecordOf<ICondColumnNode>;

export interface ICondInNode extends IConditionNode<NodeTypeEnum.COND_IN> {
  column: Maybe<TColumn>;
  value: Maybe<TInValue>;
}
export type TCondInNode = RecordOf<ICondInNode>;

export interface ICondNullNode extends IConditionNode<NodeTypeEnum.COND_NULL> {
  column: Maybe<TColumn>;
}
export type TCondNullNode = RecordOf<ICondNullNode>;

export interface ICondExistsNode extends IConditionNode<NodeTypeEnum.COND_EXISTS> {
  query: Maybe<TSubQueryNode | TRawNode>;
}
export type TCondExistsNode = RecordOf<ICondExistsNode>;

export interface ICondDateNode extends IConditionNode<NodeTypeEnum.COND_DATE> {
  type: DateCondType;
  column: Maybe<TColumn>;
  operator: string | TRawNode;
  value: Maybe<TValue>;
}
export type TCondDateNode = RecordOf<ICondDateNode>;

export interface ICondBetweenNode extends IConditionNode<NodeTypeEnum.COND_BETWEEN> {
  column: TColumn;
  first: Maybe<TValue>;
  second: Maybe<TValue>;
}
export type TCondBetweenNode = RecordOf<ICondBetweenNode>;

export interface ICondRawNode extends IConditionNode<NodeTypeEnum.COND_RAW> {
  value: Maybe<TRawNode>;
}
export type TCondRawNode = RecordOf<ICondRawNode>;

export interface IOrderByNode extends INode<NodeTypeEnum.ORDER_BY> {
  column: Maybe<TColumn>;
  direction: "ASC" | "DESC";
}
export type TOrderByNode = RecordOf<IOrderByNode>;

export interface IUnionNode extends INode<NodeTypeEnum.UNION> {
  ast: Maybe<TRawNode | TSubQueryNode>;
  all: boolean;
}

export interface ICondSubNode extends IConditionNode<NodeTypeEnum.COND_SUB> {
  ast: List<TConditionNode>;
}
export type TCondSubNode = RecordOf<ICondSubNode>;

export interface IJoinNode extends INode<NodeTypeEnum.JOIN> {
  joinType: JoinTypeEnum;
  table: TTable;
  conditions: List<TConditionNode>;
}
export type TJoinNode = RecordOf<IJoinNode>;

export interface IAggregateNode extends INode<NodeTypeEnum.AGGREGATE> {
  fn: AggregateFns;
  column: string | string[] | TSubQueryNode | TRawNode;
  alias: Maybe<string>;
  distinct: boolean;
}
export type TAggregateNode = RecordOf<IAggregateNode>;

export interface IAliasedIdentNode extends INode<NodeTypeEnum.ALIASED> {
  ident: string;
  alias: string;
}
export type TAliasedIdentNode = RecordOf<IAliasedIdentNode>;

export type TSelectNode = string | TAliasedIdentNode | TAggregateNode | TSubQueryNode | TRawNode;

export type TFromNode = string | TAliasedIdentNode | TSubQueryNode | TRawNode;

export type TConditionNode =
  | TCondExprNode
  | TCondInNode
  | TCondNullNode
  | TCondBetweenNode
  | TCondExistsNode
  | TCondColumnNode
  | TCondSubNode
  | TCondDateNode
  | TCondRawNode;

export interface IOperationNode<T> {
  __operation: T;
}
export interface ISchemaOperationNode<T> {
  __schemaOperation: T;
}

export interface ISubQuery extends INode<NodeTypeEnum.SUB_QUERY> {
  ast: Maybe<TSelectOperation>;
}
export type TSubQueryNode = RecordOf<ISubQuery>;

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
  where: List<TConditionNode>;
  having: List<TConditionNode>;
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
  where: List<TConditionNode>;
  join: List<TJoinNode | TRawNode>;
  values: IMap<string, TValue>;
  meta: IMap<string, any>;
}
export type TUpdateOperation = RecordOf<IUpdateOperation>;

export interface IDeleteOperation extends IOperationNode<OperationTypeEnum.DELETE> {
  table: string;
  where: List<TConditionNode>;
  join: List<TJoinNode>;
  meta: IMap<string, any>;
}
export type TDeleteOperation = RecordOf<IDeleteOperation>;

export interface ITruncateOperation extends IOperationNode<OperationTypeEnum.TRUNCATE> {
  table: Maybe<string>;
}
export type TTruncateOperation = RecordOf<ITruncateOperation>;

// Schema Operations:

export interface ITableColumnDefinitionNode {
  columnName: string;
  dataType: Enums.ColumnTypeEnum;
  nullable: boolean;
}
export type TTableColumnDefinitionNode = RecordOf<ITableColumnDefinitionNode>;

export interface ICreateTableOperation extends ISchemaOperationNode<SchemaOperationTypeEnum.CREATE_TABLE> {
  table: string;
  columns: List<TTableColumnDefinitionNode>;
  ifNotExists: boolean;
}
export type TCreateTableOperation = RecordOf<ICreateTableOperation>;

export interface IRenameTableOperation extends ISchemaOperationNode<SchemaOperationTypeEnum.RENAME_TABLE> {
  from: string;
  to: string;
}
export type TRenameTableOperation = RecordOf<IRenameTableOperation>;

export interface IDropTableOperation extends ISchemaOperationNode<SchemaOperationTypeEnum.DROP_TABLE> {
  table: string;
  ifExists: boolean;
}
export type TDropTableOperation = RecordOf<IDropTableOperation>;

export interface IAddColumnOperation extends ISchemaOperationNode<SchemaOperationTypeEnum.ADD_COLUMN> {
  table: string;
  column: Maybe<TTableColumnDefinitionNode>;
}
export type TAddColumnOperation = RecordOf<IAddColumnOperation>;

export interface IDropColumnOperation extends ISchemaOperationNode<SchemaOperationTypeEnum.DROP_COLUMN> {
  table: string;
  column: string;
}
export type TDropColumnOperation = RecordOf<IDropColumnOperation>;

export interface IAddIndexOperation extends ISchemaOperationNode<SchemaOperationTypeEnum.ADD_INDEX> {
  table: string;
  column: string;
  indexType: IndexTypeEnum | null;
  indexName: Maybe<string>;
}
export type TAddIndexOperation = RecordOf<IAddIndexOperation>;

export interface IModifyColumnOperation extends ISchemaOperationNode<SchemaOperationTypeEnum.MODIFY_COLUMN> {
  table: string;
}
export type TModifyColumnOperation = RecordOf<IModifyColumnOperation>;

export type TSchemaOperationAst =
  | TCreateTableOperation
  | TRenameTableOperation
  | TDropTableOperation
  | TAddColumnOperation
  | TDropColumnOperation
  | TModifyColumnOperation
  | TAddIndexOperation;

export type TOperationAst =
  | TSelectOperation
  | TUpdateOperation
  | TDeleteOperation
  | TInsertOperation
  | TTruncateOperation;

export type TAnyOperationAst = TSchemaOperationAst | TOperationAst;

export interface IBindingNode extends INode<NodeTypeEnum.BINDING> {
  name: string;
  type: Maybe<string>;
}

export interface ToSQLValue {
  sql: string;
  query: string;
  values: any[];
  fragments: string[];
}

/**
 * When a Builder is executable, it is a promise and contains all of these methods
 */
export interface ExecutableBuilder<T = any> extends Promise<T> {
  /**
   * Sets the current connection on the class
   */
  setConnection(connection: Connection): this;
  /**
   * Logs a message
   */
  log(msg: string): void;
  /**
   * Logs an error
   */
  error(err: Error): void;
  /**
   * Logs a warning
   */
  warn(msg: string | Error): void;
  /**
   * Build the query
   */
  toOperation(): ToSQLValue;
}

export type ArgumentType<F extends Function> = F extends (...args: infer A) => any ? A[0] : never;

export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export type TConditionValueArgs<T> =
  | [T | TRawNode | boolean | number | TValueCondition[] | { [column: string]: TValueArg }]
  | TValueCondition2
  | TValueCondition3;

export type TWhereConditionValueArgs = TConditionValueArgs<TWhereBuilderFn>;

export type THavingConditionValueArgs = TConditionValueArgs<THavingBuilderFn>;

export type TJoinConditionValueArgs = TConditionValueArgs<never>;

export type TJoinConditionColumnArgs =
  | [TJoinBuilderFn | TColumnCondition[] | { [column: string]: string }]
  | TColumnCondition2
  | TColumnCondition3;

export type TConditionColumnArgs =
  | [TColumnCondition[] | { [column: string]: string }]
  | TColumnCondition2
  | TColumnCondition3;

export type TBetweenArg = [TValueArg, TValueArg];

export interface ColumnInfoData {
  type: string;
  maxLength: Maybe<number>;
  nullable: boolean;
  defaultValue: any;
}
