import { List } from "immutable";
import sqlstring from "sqlstring";
import { NodeTypeEnum, OperationTypeEnum } from "./data/enums";
import { isRawNode, isSubQueryNode } from "./data/predicates";
import { deleteAst, selectAst, updateAst } from "./data/structs";
import {
  Maybe,
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
  ToSQLValue,
  TCondRawNode,
  TAggregateNode,
  TNot,
} from "./data/types";
import { validOperators } from "./data/operators";

export class Grammar {
  operators = validOperators;

  public readonly dialect = null;
  public readonly dateString = "Y-m-d H:i:s";

  protected lastAst: Maybe<TOperationAst> = null;

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
    return sqlstring.escape(value);
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
    this.addGroupBy(ast.group);
    this.addHavingClause(ast.having);
    this.addOrderByClause(ast.order);
    this.addLimit(ast.limit);
    this.addOffset(ast);
    this.addUnions(ast.union);
    this.addSelectLock(ast);
  }

  protected cacheSqlValue(ast: TOperationAst) {
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

  pushFragment() {
    this.fragments.push(this.currentFragment);
    this.currentFragment = "";
  }

  addSelectColumns(select: TSelectOperation["select"]) {
    this.addSpace();
    if (select.size === 0) {
      this.currentFragment += "*";
    }
    select.forEach((node, i) => {
      this.addSelectColumn(node);
      if (i < select.size - 1) {
        this.addComma();
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

  addSelectColumn(node: TSelectNode) {
    if (typeof node === "string") {
      this.currentFragment += this.escapeId(node);
      return;
    }
    switch (node.__typename) {
      case NodeTypeEnum.AGGREGATE:
        this.addAggregateNode(node);
        break;
      case NodeTypeEnum.SUB_QUERY:
        this.addSubQueryNode(node);
        break;
      case NodeTypeEnum.RAW:
        this.addRawNode(node);
        break;
    }
  }

  addAggregateNode({ fn, distinct, column, alias }: TAggregateNode) {
    this.addIdentifier(fn.toUpperCase());
    this.wrapParens(() => {
      if (distinct) {
        this.addIdentifier("DISTINCT ");
      }
      if (Array.isArray(column)) {
        column.forEach((node, i) => {
          this.addSelectColumn(node);
          if (i < column.length - 1) {
            this.addComma();
          }
        });
      } else {
        this.addIdentifier(column);
      }
    });
    if (alias) {
      this.addAlias(alias);
    }
  }

  /**
   * If it's a "raw node" it could have any number of values mixed in
   */
  addRawNode(node: TRawNode) {
    this.currentFragment += `${node.fragments.get(0)}`;
    if (node.bindings.size === 0) {
      return;
    }
    node.bindings.forEach((binding, i) => {
      this.addValue(binding);
      this.currentFragment += node.fragments.get(i + 1);
    });
  }

  addSubQueryNode({ ast }: TSubQueryNode) {
    if (ast && ast !== selectAst) {
      this.wrapParens(() => {
        this.buildSelect(ast);
      });
      if (ast.alias) {
        this.addAlias(ast.alias);
      }
    }
  }

  addAlias(alias: typeof selectAst["alias"]) {
    if (typeof alias === "string") {
      this.addAliasSeparator();
      this.currentFragment += this.escapeId(alias);
    } else if (isRawNode(alias)) {
      this.addRawNode(alias);
    }
  }

  addAliasSeparator() {
    this.addKeyword(" AS ");
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

  addHavingClause(having: TSelectOperation["having"]) {
    if (having.size === 0) {
      return;
    }
    this.addKeyword(" HAVING ");
    having.forEach((node, i) => {
      this.addConditionNode(node, i);
    });
  }

  addGroupBy(value: TSelectOperation["group"]) {
    if (value.size === 0) {
      return;
    }
    this.addKeyword(" GROUP BY ");
    value.forEach((group, i) => {
      this.addIdentifier(group);
      if (i < value.size - 1) {
        this.addComma();
      }
    });
  }

  addOrderByClause(order: TSelectOperation["order"]) {
    if (order.size === 0) {
      return;
    }
    this.addKeyword(" ORDER BY ");
    order.forEach(order => {
      //
    });
  }

  addLimit(val: TSelectOperation["limit"]) {
    if (val === null) {
      return;
    }
    this.addKeyword(" LIMIT ");
    this.addValue(val);
  }

  addOffset(ast: TSelectOperation) {
    if (ast.offset === null) {
      return;
    }
    this.addKeyword(" OFFSET ");
    this.addValue(ast.offset);
  }

  addUnions(ast: TSelectOperation["union"]) {
    if (ast.size === 0) {
      return;
    }
  }

  addSelectLock(ast: TSelectOperation) {
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

  addWhereClauses(nodes: List<TConditionNode>) {
    if (nodes.size === 0) {
      return;
    }
    this.addKeyword(" WHERE ");
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
        this.addBetweenCondition(node);
        break;
      case NodeTypeEnum.COND_SUB:
        this.addSubCondition(node);
        break;
      case NodeTypeEnum.COND_RAW:
        this.addRawCondition(node);
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

  addExistsCondition({ query }: TCondExistsNode) {
    if (!query) {
      return;
    }
    if (isRawNode(query)) {
      this.addKeyword("EXISTS ");
      return this.addRawNode(query);
    }
    const { ast } = query;
    if (ast && ast !== selectAst) {
      this.addKeyword("EXISTS ");
      this.wrapParens(() => {
        this.buildSelect(ast);
      });
    }
  }

  addRawCondition(node: TCondRawNode) {
    if (isRawNode(node.value)) {
      this.addRawNode(node.value);
    }
  }

  addBetweenCondition(node: TCondBetweenNode) {
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
    this.addValue(node.value);
  }

  addColumnCondition(node: TCondColumnNode) {
    if (node.not) {
      this.addKeyword("NOT ");
    }
    this.addIdentifier(node.column!);
    this.addOperator(node.operator);
    this.addIdentifier(node.rightColumn!);
  }

  addInCondition({ value, column, not }: TCondInNode) {
    if (Array.isArray(value) && value.length === 0) {
      return this.falsyCondition(not);
    }
    this.addIdentifier(column!);
    this.addKeyword(not ? " NOT IN " : " IN ");
    if (Array.isArray(value)) {
      this.wrapParens(() => {
        value.forEach((v, i) => {
          this.addValue(v);
          if (i < value.length - 1) {
            this.addComma();
          }
        });
      });
    } else {
      this.addValue(value);
    }
  }

  addSubCondition(node: TCondSubNode) {
    if (node.ast && node.ast.size > 0) {
      this.wrapParens(() => {
        node.ast.forEach((node, i) => {
          this.addConditionNode(node, i);
        });
      });
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

  addValue(value: any) {
    if (isRawNode(value)) {
      return this.addRawNode(value);
    }
    if (isSubQueryNode(value)) {
      return this.addSubQueryNode(value);
    }
    this.pushFragment();
    this.sqlValues.push(value);
  }

  addComma() {
    this.currentFragment += ", ";
  }

  addSpace() {
    this.currentFragment += " ";
  }

  addKeyword(keyword: string) {
    this.currentFragment += keyword;
  }

  falsyCondition(not: TNot) {
    this.currentFragment += `1 = ${not ? 1 : 0} `;
  }

  wrapParens(fn: Function) {
    this.currentFragment += "(";
    fn();
    this.currentFragment += ")";
  }
}
