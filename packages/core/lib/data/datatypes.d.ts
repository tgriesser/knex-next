import { Record as IRecord, List, RecordOf, Map as IMap } from "immutable";
import { Maybe, TAndOr, ColumnDataType } from "./types";
export declare enum DialectEnum {
    MYSQL = "mysql",
    SQLITE = "sqlite",
    POSTGRESQL = "postgresql",
    ORACLE = "oracle",
    MSSQL = "mssql"
}
export declare enum JoinTypeEnum {
    INNER = "INNER",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    LEFT_OUTER = "LEFT_OUTER",
    RIGHT_OUTER = "RIGHT_OUTER",
    FULL_OUTER = "FULL_OUTER",
    OUTER = "OUTER",
    CROSS = "CROSS"
}
export declare enum OperationTypeEnum {
    SELECT = "SELECT",
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    TRUNCATE = "TRUNCATE",
    CREATE_TABLE = "CREATE_TABLE",
    ALTER_TABLE = "ALTER_TABLE"
}
export declare enum OperatorEnum {
    AND = "AND",
    OR = "OR",
    NOT = "NOT"
}
export declare enum ClauseTypeEnum {
    JOIN = "JoinClause",
    WHERE = "WhereClause",
    HAVING = "HavingClause"
}
export declare enum NodeTypeEnum {
    JOIN = "JoinNode",
    ORDER_BY = "OrderByNode",
    GROUP_BY = "GroupByNode",
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
    HAVING_EXPR = "HavingExpressionNode"
}
export declare type WhereNodeTypes = NodeTypeEnum.WHERE_EXPR | NodeTypeEnum.WHERE_COLUMN | NodeTypeEnum.WHERE_IN | NodeTypeEnum.WHERE_EXISTS | NodeTypeEnum.WHERE_NULL | NodeTypeEnum.WHERE_BETWEEN | NodeTypeEnum.WHERE_LIKE | NodeTypeEnum.WHERE_SUB;
export interface INode<N extends NodeTypeEnum> {
    __typename: N;
}
/**
 * Join Node
 */
export interface IJoinNode extends INode<NodeTypeEnum.JOIN> {
}
export declare const JoinNode: IRecord.Factory<IJoinNode>;
export declare type TJoinNode = RecordOf<IJoinNode>;
export interface IClause<T extends ClauseTypeEnum> {
    __clause: T;
}
/**
 * WhereClause
 */
export interface IWhereClauseNodes extends IClause<ClauseTypeEnum.WHERE> {
    where: List<TWhereNode>;
}
export declare type TWhereClause = RecordOf<IWhereClauseNodes>;
export declare const WhereClause: IRecord.Factory<IWhereClauseNodes>;
export declare const whereClauseNode: RecordOf<IWhereClauseNodes>;
export interface IWhereNodeCommon<N extends WhereNodeTypes> extends INode<N> {
    not: Maybe<OperatorEnum.NOT>;
    andOr: TAndOr;
}
/**
 * Where Expression Node
 */
export interface IWhereExprNode extends IWhereNodeCommon<NodeTypeEnum.WHERE_EXPR> {
    column: Maybe<string>;
    operator: Maybe<string>;
    value: Maybe<any>;
}
export declare const WhereExprNode: IRecord.Factory<IWhereExprNode>;
export declare type TWhereExprNode = RecordOf<IWhereExprNode>;
/**
 * Where Expression Node
 */
export interface IWhereColumnNode extends IWhereNodeCommon<NodeTypeEnum.WHERE_COLUMN> {
    column: Maybe<string>;
    operator: Maybe<string>;
    rightColumn: Maybe<string>;
}
export declare const WhereColumnNode: IRecord.Factory<IWhereColumnNode>;
export declare type TWhereColumnNode = RecordOf<IWhereColumnNode>;
/**
 * WhereIn Node
 */
export interface WhereInNode extends IWhereNodeCommon<NodeTypeEnum.WHERE_IN> {
}
export declare const WhereInNode: IRecord.Factory<WhereInNode>;
export declare type TWhereInNode = RecordOf<WhereInNode>;
/**
 * WhereIn Node
 */
export interface WhereNullNode extends IWhereNodeCommon<NodeTypeEnum.WHERE_NULL> {
    column: Maybe<string>;
}
export declare const WhereNullNode: IRecord.Factory<WhereNullNode>;
export declare type TWhereNullNode = RecordOf<WhereNullNode>;
/**
 * WhereExists Node
 */
export interface WhereExistsNode extends IWhereNodeCommon<NodeTypeEnum.WHERE_EXISTS> {
}
export declare const WhereExistsNode: IRecord.Factory<WhereExistsNode>;
export declare type TWhereExistsNode = RecordOf<WhereExistsNode>;
/**
 * WhereBetween Node
 */
export interface WhereBetweenNode extends IWhereNodeCommon<NodeTypeEnum.WHERE_BETWEEN> {
}
export declare const WhereBetweenNode: IRecord.Factory<WhereBetweenNode>;
export declare type TWhereBetweenNode = RecordOf<WhereBetweenNode>;
/**
 * Having Node
 */
export interface IHavingNode extends INode<NodeTypeEnum.HAVING_EXPR> {
}
export declare const HavingNode: IRecord.Factory<IHavingNode>;
export declare type THavingNode = RecordOf<IHavingNode>;
/**
 * ORDER BY Node
 */
export interface IOrderByNode extends INode<NodeTypeEnum.ORDER_BY> {
    column: string | TRawNode;
    direction: "ASC" | "DESC";
}
export declare const OrderByNode: IRecord.Factory<IOrderByNode>;
export declare type TOrderByNode = RecordOf<IOrderByNode>;
/**
 * GROUP BY Node
 */
export interface IGroupByNode extends INode<NodeTypeEnum.GROUP_BY> {
    column: string | TRawNode;
}
export declare const GroupByNode: IRecord.Factory<IGroupByNode>;
export declare type TGroupByNode = RecordOf<IGroupByNode>;
/**
 * Union Node
 */
export interface IUnionNode extends INode<NodeTypeEnum.UNION> {
    ast: Maybe<TRawNode | ISelectOperation>;
}
export declare const UnionNode: IRecord.Factory<IUnionNode>;
/**
 * WhereSub Node
 */
export interface IWhereSubNode extends IWhereNodeCommon<NodeTypeEnum.WHERE_SUB> {
    ast: Maybe<TWhereClause>;
}
export declare const WhereSubNode: IRecord.Factory<IWhereSubNode>;
export declare type TWhereSubNode = RecordOf<IWhereSubNode>;
/**
 * SubQuery Node
 */
export interface ISubQuery extends INode<NodeTypeEnum.SUB_QUERY> {
    ast: Maybe<TSelectOperation>;
}
export declare const SubQueryNode: IRecord.Factory<ISubQuery>;
export declare type TSubQueryNode = RecordOf<ISubQuery>;
/**
 * Raw Node
 */
export interface IRawNode extends INode<NodeTypeEnum.RAW> {
    fragments: List<string>;
    bindings: List<any>;
}
export declare const RawNode: IRecord.Factory<IRawNode>;
export declare type TRawNode = RecordOf<IRawNode>;
export declare type NumOrRaw = number | TRawNode;
export interface IOperationNode<T> {
    __operation: T;
}
export interface IHavingClauseNodes extends IClause<ClauseTypeEnum.HAVING> {
    where: List<THavingNode>;
}
export declare type THavingClause = RecordOf<IHavingClauseNodes>;
export declare const HavingClause: IRecord.Factory<IHavingClauseNodes>;
export declare const havingClauseNode: RecordOf<IHavingClauseNodes>;
export declare type TSelectNode = string | TSubQueryNode | TRawNode;
export declare type TFromNode = string | TSubQueryNode | TRawNode;
export declare type TWhereNode = TWhereExprNode | TWhereInNode | TWhereBetweenNode | TWhereSubNode | TWhereExistsNode | TWhereColumnNode;
/**
 * Select Expressions:
 */
export interface ISelectOperation {
    __operation: OperationTypeEnum.SELECT;
    select: List<TSelectNode>;
    from: Maybe<TFromNode>;
    join: List<TJoinNode | TRawNode>;
    having: List<THavingNode>;
    order: List<TOrderByNode>;
    group: List<TGroupByNode>;
    union: List<IUnionNode>;
    limit: Maybe<NumOrRaw>;
    where: List<TWhereNode>;
    offset: Maybe<NumOrRaw>;
    distinct: boolean;
    alias: Maybe<string | TRawNode>;
    lock: Maybe<boolean | string>;
    meta: IMap<string, any>;
}
export declare const SelectOperationNodes: IRecord.Factory<ISelectOperation>;
export declare type TSelectOperation = RecordOf<ISelectOperation>;
export declare const selectAst: RecordOf<ISelectOperation>;
/**
 * Insert Bindings:
 */
export interface IInsertOperation extends IOperationNode<OperationTypeEnum.INSERT> {
    __operation: OperationTypeEnum.INSERT;
    table: Maybe<string>;
    chunkSize: Maybe<number>;
    values: List<any>;
    select: Maybe<TSelectOperation>;
}
export declare const InsertOperation: IRecord.Factory<IInsertOperation>;
export declare type TInsertOperation = RecordOf<IInsertOperation>;
export declare const insertAst: RecordOf<IInsertOperation>;
/**
 * Update Bindings:
 */
export interface IUpdateOperation extends IOperationNode<OperationTypeEnum.UPDATE> {
    __operation: OperationTypeEnum.UPDATE;
    table: string;
}
export declare const UpdateOperation: IRecord.Factory<IUpdateOperation>;
export declare type TUpdateOperation = RecordOf<IUpdateOperation>;
export declare const updateAst: RecordOf<IUpdateOperation>;
/**
 * Delete Bindings:
 */
export interface IDeleteOperation extends IOperationNode<OperationTypeEnum.DELETE> {
    table: string;
    where: List<TWhereNode>;
}
export declare const DeleteBindings: IRecord.Factory<IDeleteOperation>;
export declare type TDeleteOperation = RecordOf<IDeleteOperation>;
export declare const deleteAst: RecordOf<IDeleteOperation>;
/**
 * Truncate Bindings:
 */
export interface ITruncateOperation extends IOperationNode<OperationTypeEnum.TRUNCATE> {
    table: Maybe<string>;
}
export declare const TruncateBindings: IRecord.Factory<ITruncateOperation>;
export declare type TTruncateOperation = RecordOf<ITruncateOperation>;
export declare const truncateAst: RecordOf<ITruncateOperation>;
/**
 * Create Table Bindings:
 */
export interface ICreateTableOperation extends IOperationNode<OperationTypeEnum.CREATE_TABLE> {
    __operation: OperationTypeEnum.CREATE_TABLE;
    table: string;
    columns: List<TCreateTableColumnNode>;
}
export declare const CreateTableOperation: IRecord.Factory<ICreateTableOperation>;
export declare type TCreateTableOperation = RecordOf<ICreateTableOperation>;
export interface ICreateTableColumnNode {
    dataType: Maybe<ColumnDataType>;
}
export declare const CreateTableColumnNode: IRecord.Factory<ICreateTableColumnNode>;
export declare type TCreateTableColumnNode = RecordOf<ICreateTableColumnNode>;
export declare const createTableAst: RecordOf<ICreateTableOperation>;
export declare type TOperationAst = TSelectOperation | TUpdateOperation | TDeleteOperation | TInsertOperation | TTruncateOperation;
export declare type TClauseAst = TWhereClause;
