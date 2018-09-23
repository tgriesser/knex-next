"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatypes_1 = require("./data/datatypes");
const predicates_1 = require("./data/predicates");
class Grammar {
    constructor() {
        this.dialect = null;
        this.dateString = "Y-m-d H:i:s";
        this.lastAst = null;
        this.currentFragment = "";
        this.fragments = [];
        this.sqlValues = [];
        this.sqlWithBindings = "";
        this.sqlWithValues = "";
    }
    newInstance() {
        return new this.constructor();
    }
    escapeId(arg) {
        return arg
            .split(".")
            .map(f => (f === "*" ? "*" : this.escapeIdFragment(f)))
            .join(".");
    }
    /**
     * By default, we don't do any escaping on the id's. That is
     * determined by the dialect.
     */
    escapeIdFragment(arg) {
        return arg;
    }
    escapeValue(value) {
        return value;
    }
    getBinding(index) {
        return "?";
    }
    toSql(operationAst) {
        this.toOperation(operationAst);
        return this.sqlWithValues;
    }
    toOperation(operationAst) {
        if (operationAst === this.lastAst) {
            return this.sqlValue();
        }
        else {
            this.resetState();
        }
        this.buildOperation(operationAst);
        return this.cacheSqlValue(operationAst);
    }
    toClause(clauseAst) {
        if (clauseAst === this.lastAst) {
            return this.sqlValue();
        }
        else {
            this.resetState();
        }
        this.buildClause(clauseAst);
        return this.cacheSqlValue(clauseAst);
    }
    resetState() {
        this.currentFragment = "";
        this.fragments = [];
        this.sqlValues = [];
    }
    buildOperation(operationAst) {
        switch (operationAst.__operation) {
            case datatypes_1.OperationTypeEnum.SELECT:
                this.buildSelect(operationAst);
                break;
            case datatypes_1.OperationTypeEnum.INSERT:
                this.buildInsert(operationAst);
                break;
            case datatypes_1.OperationTypeEnum.DELETE:
                this.buildDelete(operationAst);
                break;
            case datatypes_1.OperationTypeEnum.UPDATE:
                this.buildUpdate(operationAst);
                break;
            case datatypes_1.OperationTypeEnum.TRUNCATE:
                this.buildTruncate(operationAst);
                break;
        }
    }
    buildClause(clauseAst) {
        switch (clauseAst.__clause) {
            case datatypes_1.ClauseTypeEnum.WHERE:
                this.buildWhereClause(clauseAst.where, true);
                break;
        }
    }
    sqlValue() {
        return {
            fragments: this.fragments,
            values: this.sqlValues,
            query: this.sqlWithBindings,
            sql: this.sqlWithValues,
        };
    }
    buildSelect(ast) {
        this.addKeyword("SELECT");
        if (ast.distinct) {
            this.addKeyword(" DISTINCT");
        }
        this.buildSelectColumns(ast.select);
        this.buildSelectFrom(ast);
        this.buildJoinClauses(ast);
        this.buildWhereClause(ast.where);
        this.buildSelectGroupBy(ast);
        this.buildHavingClause(ast);
        this.buildOrderByClause(ast);
        this.buildSelectLimit(ast);
        this.buildSelectOffset(ast);
        this.buildSelectUnions(ast);
        this.buildSelectLock(ast);
    }
    cacheSqlValue(ast) {
        this.pushFragment();
        const { fragments, sqlValues } = this;
        let sql = fragments[0];
        let sqlWithBindings = fragments[0];
        for (let i = 0; i < sqlValues.length; i++) {
            sql += this.escapeValue(sqlValues[i]);
            sqlWithBindings += this.getBinding(i);
            sql += fragments[i + 1];
            sqlWithBindings += fragments[i + 1];
        }
        this.sqlWithValues = sql;
        this.sqlWithBindings = sqlWithBindings;
        this.lastAst = ast;
        return this.sqlValue();
    }
    pushValue(value) {
        this.pushFragment();
        this.sqlValues.push(value);
    }
    pushFragment() {
        this.fragments.push(this.currentFragment);
        this.currentFragment = "";
    }
    buildSelectColumns(select) {
        if (select.size === 0) {
            this.currentFragment += " *";
        }
        select.forEach((node, i) => {
            this.buildSelectColumn(node);
            if (i < select.size - 1) {
                this.currentFragment += ",";
            }
        });
    }
    buildSelectFrom(ast) {
        if (ast.from === null) {
            return;
        }
        this.addKeyword(" FROM");
        if (typeof ast.from === "string") {
            this.currentFragment += ` ${this.escapeId(ast.from)}`;
            return;
        }
        switch (ast.from.__typename) {
            case datatypes_1.NodeTypeEnum.SUB_QUERY:
                break;
            case datatypes_1.NodeTypeEnum.RAW:
                break;
        }
    }
    buildSelectColumn(node) {
        if (typeof node === "string") {
            this.currentFragment += ` ${this.escapeId(node)}`;
            return;
        }
        switch (node.__typename) {
            case datatypes_1.NodeTypeEnum.SUB_QUERY:
                this.addSubQueryNode(node);
                break;
            case datatypes_1.NodeTypeEnum.RAW:
                this.addRawNode(node);
                break;
        }
    }
    /**
     * If it's a "raw node" it could have any number of values mixed in
     */
    addRawNode(node) {
        if (node.bindings.size === 0) {
            this.currentFragment += ` ${node.fragments.get(0)}`;
        }
    }
    addSubQueryNode(node) {
        if (node.ast && node.ast !== datatypes_1.selectAst) {
            this.currentFragment += " (";
            this.buildSelect(node.ast);
            this.currentFragment += ")";
            if (node.ast.alias) {
                this.addAlias(node.ast.alias);
            }
        }
    }
    addAlias(alias) {
        if (typeof alias === "string") {
            this.addKeyword(" AS ");
            this.currentFragment += this.escapeId(alias);
        }
        else if (predicates_1.isRawNode(alias)) {
            this.addRawNode(alias);
        }
    }
    buildJoinClauses(ast) {
        if (ast.join.size === 0) {
            return;
        }
        this.addKeyword("");
        ast.join.forEach(join => {
            //
        });
    }
    buildHavingClause(ast) {
        if (ast.having.size === 0) {
            return;
        }
        this.addKeyword("");
        ast.having.forEach(having => {
            //
        });
    }
    buildSelectGroupBy(ast) {
        if (ast.group.size === 0) {
            return;
        }
        this.addKeyword(" GROUP BY");
        ast.group.forEach(group => {
            //
        });
    }
    buildOrderByClause(ast) {
        if (ast.order.size === 0) {
            return;
        }
        this.addKeyword(" ORDER BY");
        ast.order.forEach(order => {
            //
        });
    }
    buildSelectLimit(ast) {
        if (!ast.limit) {
            return;
        }
        this.addKeyword(" LIMIT");
        if (typeof ast.limit === "number") {
            this.currentFragment += ast.limit;
        }
        else {
        }
    }
    buildSelectOffset(ast) {
        //
    }
    buildSelectUnions(ast) {
        //
    }
    buildSelectLock(ast) {
        //
    }
    buildInsert(ast) {
        if (!ast.table) {
            return null;
        }
        this.addKeyword("INSERT INTO ");
        this.currentFragment += this.escapeId(ast.table);
        if (ast.select) {
            if (ast.values.size > 0) {
                console.error("");
            }
            this.currentFragment += " ";
            this.buildSelect(ast.select);
        }
    }
    buildUpdate(ast) {
        if (ast === datatypes_1.updateAst) {
            return;
        }
        this.addKeyword("UPDATE ");
        this.currentFragment += this.escapeId(ast.table);
    }
    buildDelete(ast) {
        if (ast === datatypes_1.deleteAst) {
            return;
        }
        this.addKeyword("DELETE FROM ");
        this.currentFragment += this.escapeId(ast.table);
        this.buildWhereClause(ast.where);
    }
    buildWhereClause(nodes, subWhere = false) {
        if (nodes.size === 0) {
            return;
        }
        this.addKeyword(subWhere ? "" : " WHERE ");
        nodes.forEach((node, i) => {
            if (i > 0) {
                this.addKeyword(` ${node.andOr} `);
            }
            switch (node.__typename) {
                case datatypes_1.NodeTypeEnum.WHERE_EXPR:
                    this.buildWhereExpr(node);
                    break;
                case datatypes_1.NodeTypeEnum.WHERE_COLUMN:
                    this.buildWhereColumn(node);
                    break;
                case datatypes_1.NodeTypeEnum.WHERE_IN:
                    this.buildWhereIn(node);
                    break;
                case datatypes_1.NodeTypeEnum.WHERE_EXISTS:
                    this.buildWhereExists(node);
                    break;
                case datatypes_1.NodeTypeEnum.WHERE_BETWEEN:
                    this.buildWhereBetween(node);
                    break;
                case datatypes_1.NodeTypeEnum.WHERE_SUB:
                    this.buildWhereSub(node);
                    break;
            }
        });
    }
    buildWhereExists(node) {
        //
    }
    buildWhereBetween(node) {
        this.addKeyword("BETWEEN");
    }
    buildWhereExpr(node) {
        if (!node.column) {
            return;
        }
        if (node.not) {
            this.addKeyword("NOT ");
        }
        this.currentFragment += this.escapeId(node.column);
        this.currentFragment += ` ${node.operator} `;
        this.pushValue(node.value);
    }
    buildWhereColumn(node) {
        if (node.not) {
            this.addKeyword("NOT ");
        }
    }
    buildWhereIn(node) {
        this.addKeyword(node.not ? "NOT IN " : "IN ");
    }
    buildWhereSub(node) {
        if (node.ast && node.ast.where.size > 0) {
            this.currentFragment += "(";
            this.buildWhereClause(node.ast.where, true);
            this.currentFragment += ")";
        }
    }
    buildTruncate(node) {
        if (node.table) {
            this.addKeyword("TRUNCATE TABLE ");
            this.currentFragment += this.escapeId(node.table);
        }
    }
    addKeyword(keyword) {
        this.currentFragment += keyword;
    }
}
exports.Grammar = Grammar;
