import { List } from "immutable";
import { NodeTypeEnum, OperationTypeEnum } from "./data/enums";
import { isRawNode, isSubQueryNode } from "./data/predicates";
import { deleteAst, selectAst, updateAst } from "./data/structs";
import {
  Maybe,
  TClauseAst,
  TDeleteOperation,
  TInsertOperation,
  TOperationAst,
  TRawNode,
  TSelectNode,
  TSelectOperation,
  TSubQueryNode,
  TTruncateOperation,
  TUpdateOperation,
  TCondBetweenNode,
  TCondColumnNode,
  TCondExistsNode,
  TCondExprNode,
  TCondInNode,
  TConditionNode,
  TCondSubNode,
  TCondNullNode,
  TColumn,
  TTable,
  TOperatorArg,
} from "./data/types";
import { validOperators } from "@knex/core/src/data/operators";

export interface ToSQLValue {
  sql: string;
  query: string;
  values: any[];
  fragments: string[];
}

export class Grammar {
  operators = validOperators;

  public readonly dialect = null;
  public readonly dateString = "Y-m-d H:i:s";

  protected lastAst: Maybe<TOperationAst | TClauseAst> = null;

  protected currentFragment: string = "";
  protected fragments: string[] = [];

  protected sqlValues: any[] = [];
  protected sqlWithBindings: string = "";
  protected sqlWithValues: string = "";
  protected hasBindingValue: boolean = false;
  protected hasUndefinedValue: boolean = false;

  newInstance(): this {
    return new (<any>this.constructor)();
  }

  escapeId(arg: string | number) {
    if (typeof arg === "number") {
      return arg;
    }
    return arg
      .split(".")
      .map(f => (f === "*" ? "*" : this.escapeIdFragment(f)))
      .join(".");
  }

  /**
   * By default, we don't do any escaping on the id's. That is
   * determined by the dialect.
   */
  escapeIdFragment(arg: string) {
    return arg;
  }

  escapeValue(value: null | string | number | Date | Object) {
    return value;
  }

  getBinding(index: number) {
    return "?";
  }

  toSql(operationAst: TOperationAst): string {
    this.toOperation(operationAst);
    return this.sqlWithValues;
  }

  toOperation(operationAst: TOperationAst): ToSQLValue {
    if (operationAst === this.lastAst) {
      return this.sqlValue();
    } else {
      this.resetState();
    }
    this.buildOperation(operationAst);
    return this.cacheSqlValue(operationAst);
  }

  protected resetState() {
    this.currentFragment = "";
    this.fragments = [];
    this.sqlValues = [];
  }

  protected buildOperation(operationAst: TOperationAst) {
    switch (operationAst.__operation) {
      case OperationTypeEnum.SELECT:
        this.buildSelect(operationAst);
        break;
      case OperationTypeEnum.INSERT:
        this.buildInsert(operationAst);
        break;
      case OperationTypeEnum.DELETE:
        this.buildDelete(operationAst);
        break;
      case OperationTypeEnum.UPDATE:
        this.buildUpdate(operationAst);
        break;
      case OperationTypeEnum.TRUNCATE:
        this.buildTruncate(operationAst);
        break;
    }
  }

  protected sqlValue() {
    return {
      fragments: this.fragments,
      values: this.sqlValues,
      query: this.sqlWithBindings,
      sql: this.sqlWithValues,
    };
  }

  buildSelect(ast: TSelectOperation) {
    this.addKeyword("SELECT");
    if (ast.distinct) {
      this.addKeyword(" DISTINCT");
    }
    this.addSelectColumns(ast.select);
    this.addSelectFrom(ast);
    this.addJoinClauses(ast.join);
    this.addWhereClauses(ast.where);
    this.addGroupBy(ast);
    this.addHavingClause(ast.having);
    this.addOrderByClause(ast);
    this.addLimit(ast.limit);
    this.addOffset(ast.offset);
    this.addUnions(ast);
    this.buildSelectLock(ast);
  }

  protected cacheSqlValue(ast: TOperationAst | TClauseAst) {
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

  pushValue(value: any) {
    this.pushFragment();
    this.sqlValues.push(value);
  }

  pushFragment() {
    this.fragments.push(this.currentFragment);
    this.currentFragment = "";
  }

  addSelectColumns(select: TSelectOperation["select"]) {
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

  addSelectFrom(ast: TSelectOperation) {
    if (ast.from === null) {
      return;
    }
    this.addKeyword(" FROM");
    if (typeof ast.from === "string") {
      this.currentFragment += ` ${this.escapeId(ast.from)}`;
      return;
    }
    switch (ast.from.__typename) {
      case NodeTypeEnum.SUB_QUERY:
        break;
      case NodeTypeEnum.RAW:
        break;
    }
  }

  buildSelectColumn(node: TSelectNode) {
    if (typeof node === "string") {
      this.currentFragment += ` ${this.escapeId(node)}`;
      return;
    }
    switch (node.__typename) {
      case NodeTypeEnum.SUB_QUERY:
        this.addSubQueryNode(node);
        break;
      case NodeTypeEnum.RAW:
        this.addRawNode(node);
        break;
    }
  }

  /**
   * If it's a "raw node" it could have any number of values mixed in
   */
  addRawNode(node: TRawNode) {
    if (node.bindings.size === 0) {
      this.currentFragment += ` ${node.fragments.get(0)}`;
    }
  }

  addSubQueryNode(node: TSubQueryNode) {
    if (node.ast && node.ast !== selectAst) {
      this.currentFragment += " (";
      this.buildSelect(node.ast);
      this.currentFragment += ")";
      if (node.ast.alias) {
        this.addAlias(node.ast.alias);
      }
    }
  }

  addAlias(alias: typeof selectAst["alias"]) {
    if (typeof alias === "string") {
      this.addKeyword(" AS ");
      this.currentFragment += this.escapeId(alias);
    } else if (isRawNode(alias)) {
      this.addRawNode(alias);
    }
  }

  addJoinClauses(joins: TSelectOperation["join"]) {
    if (joins.size === 0) {
      return;
    }
    joins.forEach(join => {
      switch (join.__typename) {
        case NodeTypeEnum.RAW:
          break;
        case NodeTypeEnum.JOIN:
          this.addKeyword(` ${join.joinType} JOIN `);
          this.addIdentifier(join.table);
          if (join.conditions.size > 0) {
            this.addKeyword(" ON ");
            join.conditions.forEach((cond, i) => {
              this.addConditionNode(cond, i);
            });
          }
      }
    });
  }

  addHavingClause(having: TSelectOperation["having"], subHaving: boolean = false) {
    if (having.size === 0) {
      return;
    }
    this.addKeyword("HAVING ");
    having.forEach((node, i) => {
      this.addConditionNode(node, i);
    });
  }

  addGroupBy(ast: TSelectOperation) {
    if (ast.group.size === 0) {
      return;
    }
    this.addKeyword(" GROUP BY");
    ast.group.forEach(group => {
      //
    });
  }

  addOrderByClause(ast: TSelectOperation) {
    if (ast.order.size === 0) {
      return;
    }
    this.addKeyword(" ORDER BY");
    ast.order.forEach(order => {
      //
    });
  }

  addLimit(limit: TSelectOperation["limit"]) {
    if (limit === null) {
      return;
    }
    this.addKeyword(" LIMIT");
    if (typeof limit === "number") {
      this.currentFragment += limit;
    } else {
      this.addRawNode(limit);
    }
  }

  addOffset(offset: TSelectOperation["offset"]) {
    //
  }

  addUnions(ast: TSelectOperation) {
    //
  }

  buildSelectLock(ast: TSelectOperation) {
    //
  }

  buildInsert(ast: TInsertOperation) {
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

  buildUpdate(ast: TUpdateOperation) {
    if (ast === updateAst) {
      return;
    }
    this.addKeyword("UPDATE ");
    this.currentFragment += this.escapeId(ast.table);
  }

  buildDelete(ast: TDeleteOperation) {
    if (ast === deleteAst) {
      return;
    }
    this.addKeyword("DELETE FROM ");
    this.currentFragment += this.escapeId(ast.table);
    this.addWhereClauses(ast.where);
  }

  addWhereClauses(nodes: List<TConditionNode>, subWhere: boolean = false) {
    if (nodes.size === 0) {
      return;
    }
    this.addKeyword(subWhere ? "" : " WHERE ");
    nodes.forEach((node, i) => {
      this.addConditionNode(node, i);
    });
  }

  addConditionNode(node: TConditionNode, i: number) {
    if (i > 0) {
      this.addKeyword(` ${node.andOr} `);
    }
    switch (node.__typename) {
      case NodeTypeEnum.COND_EXPR:
        this.addExpressionCondition(node);
        break;
      case NodeTypeEnum.COND_COLUMN:
        this.addColumnCondition(node);
        break;
      case NodeTypeEnum.COND_IN:
        this.addInCondition(node);
        break;
      case NodeTypeEnum.COND_EXISTS:
        this.addExistsCondition(node);
        break;
      case NodeTypeEnum.COND_NULL:
        this.addNullCondition(node);
        break;
      case NodeTypeEnum.COND_BETWEEN:
        this.buildWhereBetween(node);
        break;
      case NodeTypeEnum.COND_SUB:
        this.buildWhereSub(node);
        break;
    }
  }

  addNullCondition(node: TCondNullNode) {
    if (!node.column) {
      return;
    }
    this.addIdentifier(node.column);
    this.addKeyword(" IS ");
    if (node.not) {
      this.addKeyword("NOT ");
    }
    this.addKeyword("NULL");
  }

  addExistsCondition(node: TCondExistsNode) {
    //
  }

  buildWhereBetween(node: TCondBetweenNode) {
    this.addKeyword("BETWEEN");
  }

  addExpressionCondition(node: TCondExprNode) {
    if (!node.column) {
      return;
    }
    if (node.not) {
      this.addKeyword("NOT ");
    }
    this.addIdentifier(node.column);
    this.addOperator(node.operator);
    this.pushValue(node.value);
  }

  addColumnCondition(node: TCondColumnNode) {
    if (node.not) {
      this.addKeyword("NOT ");
    }
    this.addIdentifier(node.column!);
    this.addOperator(node.operator);
    this.addIdentifier(node.rightColumn!);
  }

  addInCondition(node: TCondInNode) {
    this.addIdentifier(node.column!);
    this.addKeyword(node.not ? " NOT IN " : " IN ");
    if (isRawNode(node.value)) {
      return this.addRawNode(node.value);
    }
    if (isSubQueryNode(node.value)) {
      return this.addSubQueryNode(node.value);
    }
  }

  buildWhereSub(node: TCondSubNode) {
    if (node.ast && node.ast.size > 0) {
      this.currentFragment += "(";
      node.ast.forEach((node, i) => {
        this.addConditionNode(node, i);
      });
      this.currentFragment += ")";
    }
  }

  buildTruncate(node: TTruncateOperation) {
    if (node.table) {
      this.addKeyword("TRUNCATE TABLE ");
      this.currentFragment += this.escapeId(node.table);
    }
  }

  addIdentifier(ident: TColumn | TTable) {
    if (typeof ident === "number") {
      this.currentFragment += ident;
    }
    if (typeof ident === "string") {
      this.currentFragment += this.escapeId(ident);
    }
    if (isRawNode(ident)) {
      return this.addRawNode(ident);
    }
    if (isSubQueryNode(ident)) {
      return this.addSubQueryNode(ident);
    }
  }

  addOperator(op: TOperatorArg) {
    if (isRawNode(op)) {
      return this.addRawNode(op);
    }
    if (!this.operators.has(op)) {
      throw new Error(`The operator "${op}" is not permitted`);
    }
    this.currentFragment += ` ${op} `;
  }

  addKeyword(keyword: string) {
    this.currentFragment += keyword;
  }
}
