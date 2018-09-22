import {
  TOperationAst,
  OperationTypeEnum,
  TSelectOperation,
  TInsertOperation,
  TUpdateOperation,
  TDeleteOperation,
  TSelectNode,
  NodeTypeEnum,
  TRawNode,
  TSubQueryNode,
  TClauseAst,
  ClauseTypeEnum,
  TWhereClause,
  TWhereNode,
  TWhereExprNode,
  TWhereColumnNode,
  TWhereInNode,
  TWhereSubNode,
  TWhereExistsNode,
  TWhereBetweenNode,
  selectAst,
} from "./data/datatypes";
import { List } from "immutable";
import { Maybe } from "./data/types";
import { isRawNode } from "./data/predicates";

interface ToSQLValue {
  sql: string;
  query: string;
  values: any[];
  fragments: string[];
}

export class Grammar {
  public readonly dialect = null;
  public readonly dateString = "Y-m-d H:i:s";

  // Uses the immutable guarentees of the AST to memoize the query build
  protected lastAst: Maybe<TOperationAst | TClauseAst> = null;

  protected currentFragment: string = "";
  protected fragments: string[] = [];

  protected sqlValues: any[] = [];
  protected sqlWithBindings: string = "";
  protected sqlWithValues: string = "";

  newInstance(): this {
    return new (<any>this.constructor)();
  }

  /**
   * By default, we don't do any escaping on the id's. That is
   * determined by the dialect.
   */
  escapeId(arg: string) {
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

  toClause(clauseAst: TWhereClause): ToSQLValue {
    if (clauseAst === this.lastAst) {
      return this.sqlValue();
    } else {
      this.resetState();
    }
    this.buildClause(clauseAst);
    return this.cacheSqlValue(clauseAst);
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
    }
  }

  protected buildClause(clauseAst: TClauseAst) {
    switch (clauseAst.__clause) {
      case ClauseTypeEnum.WHERE:
        this.buildWhere(clauseAst.where, true);
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
    this.buildSelectColumns(ast.select);
    this.buildSelectFrom(ast);
    this.buildWhere(ast.where);
    this.buildSelectGroupBy(ast);
    this.buildSelectHaving(ast);
    this.buildSelectOrderBy(ast);
    this.buildSelectLimit(ast);
    this.buildSelectOffset(ast);
    this.buildSelectUnions(ast);
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

  buildSelectColumns(select: TSelectOperation["select"]) {
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

  buildSelectFrom(ast: TSelectOperation) {
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

  buildSelectJoin(ast: TSelectOperation) {
    //
  }

  buildSelectWhere(ast: TSelectOperation) {
    //
  }

  buildSelectGroupBy(ast: TSelectOperation) {
    //
  }

  buildSelectHaving(ast: TSelectOperation) {
    //
  }

  buildSelectOrderBy(ast: TSelectOperation) {
    //
  }

  buildSelectLimit(ast: TSelectOperation) {
    //
  }

  buildSelectOffset(ast: TSelectOperation) {
    //
  }

  buildSelectUnions(ast: TSelectOperation) {
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

  buildUpdate(ast: TUpdateOperation) {}

  buildDelete(ast: TDeleteOperation) {}

  buildWhere(nodes: List<TWhereNode>, subWhere: boolean = false) {
    if (nodes.size === 0) {
      return;
    }
    this.addKeyword(subWhere ? "" : " WHERE ");
    nodes.forEach((node, i) => {
      if (i > 0) {
        this.addKeyword(` ${node.andOr} `);
      }
      switch (node.__typename) {
        case NodeTypeEnum.WHERE_EXPR:
          this.buildWhereExpr(node);
          break;
        case NodeTypeEnum.WHERE_COLUMN:
          this.buildWhereColumn(node);
          break;
        case NodeTypeEnum.WHERE_IN:
          this.buildWhereIn(node);
          break;
        case NodeTypeEnum.WHERE_EXISTS:
          this.buildWhereExists(node);
          break;
        case NodeTypeEnum.WHERE_BETWEEN:
          this.buildWhereBetween(node);
          break;
        case NodeTypeEnum.WHERE_SUB:
          this.buildWhereSub(node);
          break;
      }
    });
  }

  buildWhereExists(node: TWhereExistsNode) {
    //
  }

  buildWhereBetween(node: TWhereBetweenNode) {
    this.addKeyword("BETWEEN");
  }

  buildWhereExpr(node: TWhereExprNode) {
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

  buildWhereColumn(node: TWhereColumnNode) {
    if (node.not) {
      this.addKeyword("NOT ");
    }
  }

  buildWhereIn(node: TWhereInNode) {
    this.addKeyword(node.not ? "NOT IN " : "IN ");
  }

  buildWhereSub(node: TWhereSubNode) {
    if (node.ast && node.ast.where.size > 0) {
      this.currentFragment += "(";
      this.buildWhere(node.ast.where, true);
      this.currentFragment += ")";
    }
  }

  /**
   * A raw node can have any number of values interpolated.
   * If we see one that is unique to knex, unpack it.
   */
  unpackRawNode() {}

  addKeyword(keyword: string) {
    this.currentFragment += keyword;
  }
}
