import { TOperationAst, TSelectOperation, TInsertOperation, TUpdateOperation, TDeleteOperation, TSelectNode, TRawNode, TSubQueryNode, TClauseAst, TWhereClause, TWhereNode, TWhereExprNode, TWhereColumnNode, TWhereInNode, TWhereSubNode, TWhereExistsNode, TWhereBetweenNode, selectAst, TTruncateOperation } from "./data/datatypes";
import { List } from "immutable";
import { Maybe } from "./data/types";
export interface ToSQLValue {
    sql: string;
    query: string;
    values: any[];
    fragments: string[];
}
export declare class Grammar {
    readonly dialect: null;
    readonly dateString: string;
    protected lastAst: Maybe<TOperationAst | TClauseAst>;
    protected currentFragment: string;
    protected fragments: string[];
    protected sqlValues: any[];
    protected sqlWithBindings: string;
    protected sqlWithValues: string;
    newInstance(): this;
    escapeId(arg: string): string;
    /**
     * By default, we don't do any escaping on the id's. That is
     * determined by the dialect.
     */
    escapeIdFragment(arg: string): string;
    escapeValue(value: null | string | number | Date | Object): string | number | Object | Date | null;
    getBinding(index: number): string;
    toSql(operationAst: TOperationAst): string;
    toOperation(operationAst: TOperationAst): ToSQLValue;
    toClause(clauseAst: TWhereClause): ToSQLValue;
    protected resetState(): void;
    protected buildOperation(operationAst: TOperationAst): void;
    protected buildClause(clauseAst: TClauseAst): void;
    protected sqlValue(): {
        fragments: string[];
        values: any[];
        query: string;
        sql: string;
    };
    buildSelect(ast: TSelectOperation): void;
    protected cacheSqlValue(ast: TOperationAst | TClauseAst): {
        fragments: string[];
        values: any[];
        query: string;
        sql: string;
    };
    pushValue(value: any): void;
    pushFragment(): void;
    buildSelectColumns(select: TSelectOperation["select"]): void;
    buildSelectFrom(ast: TSelectOperation): void;
    buildSelectColumn(node: TSelectNode): void;
    /**
     * If it's a "raw node" it could have any number of values mixed in
     */
    addRawNode(node: TRawNode): void;
    addSubQueryNode(node: TSubQueryNode): void;
    addAlias(alias: typeof selectAst["alias"]): void;
    buildJoinClauses(ast: TSelectOperation): void;
    buildHavingClause(ast: TSelectOperation): void;
    buildSelectGroupBy(ast: TSelectOperation): void;
    buildOrderByClause(ast: TSelectOperation): void;
    buildSelectLimit(ast: TSelectOperation): void;
    buildSelectOffset(ast: TSelectOperation): void;
    buildSelectUnions(ast: TSelectOperation): void;
    buildSelectLock(ast: TSelectOperation): void;
    buildInsert(ast: TInsertOperation): null | undefined;
    buildUpdate(ast: TUpdateOperation): void;
    buildDelete(ast: TDeleteOperation): void;
    buildWhereClause(nodes: List<TWhereNode>, subWhere?: boolean): void;
    buildWhereExists(node: TWhereExistsNode): void;
    buildWhereBetween(node: TWhereBetweenNode): void;
    buildWhereExpr(node: TWhereExprNode): void;
    buildWhereColumn(node: TWhereColumnNode): void;
    buildWhereIn(node: TWhereInNode): void;
    buildWhereSub(node: TWhereSubNode): void;
    buildTruncate(node: TTruncateOperation): void;
    addKeyword(keyword: string): void;
}
