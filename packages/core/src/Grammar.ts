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
  TWhereClause,
  TClauseAst,
  ClauseTypeEnum,
  TWhereNode,
  TWhereExprNode,
  TWhereColumnNode,
  TWhereInNode,
  TWhereSubNode,
  TWhereExistsNode,
  TWhereBetweenNode,
} from "./data/datatypes";
import { List } from "immutable";
import { Maybe } from "./data/types";

interface ToSQLValue {
  sql: string;
  query: string;
  values: any[];
  fragments: string[];
}

export class Grammar {
  public readonly dialect = null;
  public readonly dateString = "Y-m-d H:i:s";

  // The only state stored on the class. Uses the
  // immutable guarentees of the AST to memoize the query build
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
      sql: this.sqlWithValues,
      query: this.sqlWithBindings,
      values: this.sqlValues,
      fragments: this.fragments,
    };
  }

  buildSelect(ast: TSelectOperation) {
    this.currentFragment += "SELECT";
    if (ast.distinct) {
      this.currentFragment += " DISTINCT";
    }
    this.buildSelectColumns(ast.select);
    this.buildSelectFrom(ast);
    this.buildWhere(ast.where);
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
    this.currentFragment += " FROM";
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

  addSubQueryNode(node: TSubQueryNode) {}

  buildSelectJoin(ast: TSelectOperation) {}

  buildSelectWhere(ast: TSelectOperation) {}

  buildSelectGroupBy(ast: TSelectOperation) {}

  buildSelectHaving(ast: TSelectOperation) {}

  buildInsert(ast: TInsertOperation) {
    if (!ast.table) {
      return null;
    }
    this.currentFragment += `INSERT INTO ${this.escapeId(ast.table)}`;
  }

  buildUpdate(ast: TUpdateOperation) {}

  buildDelete(ast: TDeleteOperation) {}

  buildWhere(nodes: List<TWhereNode>, subWhere: boolean = false) {
    if (nodes.size === 0) {
      return;
    }
    this.currentFragment += subWhere ? "" : " WHERE ";
    nodes.forEach((node, i) => {
      if (i > 0) {
        this.currentFragment += ` ${node.andOr} `;
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
    //
  }

  buildWhereExpr(node: TWhereExprNode) {
    if (!node.column) {
      return;
    }
    if (node.not) {
      this.currentFragment += "NOT ";
    }
    this.currentFragment += this.escapeId(node.column);
    this.currentFragment += ` ${node.operator} `;
    this.pushValue(node.value);
  }

  buildWhereColumn(node: TWhereColumnNode) {
    if (node.not) {
      this.currentFragment += "NOT ";
    }
  }

  buildWhereIn(node: TWhereInNode) {
    this.currentFragment += node.not ? "NOT IN " : "IN ";
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
}

// class BaseGrammar {
//     /**
//      * The grammar table prefix.
//      *
//      * @var string
//      */
//     protected $tablePrefix = '';
//     /**
//      * Wrap an array of values.
//      *
//      * @param  array  $values
//      * @return array
//      */
//     wrapArray(values: Array<any>)
//     {
//         return values.map((val) => this.wrap(val))
//     }
//     /**
//      * Wrap a table in keyword identifiers.
//      *
//      * @param  \Illuminate\Database\Query\Expression|string  $table
//      * @return string
//      */
//     wrapTable(table: string) {
//         if (!this.isExpression($table)) {
//             return this.wrap(this.tablePrefix.$table, true);
//         }
//         return this.getValue($table);
//     }
//     /**
//      * Wrap a value in keyword identifiers.
//      *
//      * @param  \Illuminate\Database\Query\Expression|string  $value
//      * @param  bool    $prefixAlias
//      * @return string
//      */
//     wrap($value, $prefixAlias = false)
//     {
//         if (this.isExpression($value)) {
//             return this.getValue($value);
//         }
//         // If the value being wrapped has a column alias we will need to separate out
//         // the pieces so we can wrap each of the segments of the expression on its
//         // own, and then join these both back together using the "as" connector.
//         if (stripos($value, ' as ') !== false) {
//             return this.wrapAliasedValue($value, $prefixAlias);
//         }
//         return this.wrapSegments(explode('.', $value));
//     }
//     /**
//      * Wrap a value that has an alias.
//      *
//      * @param  string  $value
//      * @param  bool  $prefixAlias
//      * @return string
//      */
//     protected  wrapAliasedValue($value, $prefixAlias = false)
//     {
//         $segments = preg_split('/\s+as\s+/i', $value);
//         // If we are wrapping a table we need to prefix the alias with the table prefix
//         // as well in order to generate proper syntax. If this is a column of course
//         // no prefix is necessary. The condition will be true when from wrapTable.
//         if ($prefixAlias) {
//             $segments[1] = this.tablePrefix.$segments[1];
//         }
//         return this.wrap(
//             $segments[0]).' as '.this.wrapValue($segments[1]
//         );
//     }
//     /**
//      * Wrap the given value segments.
//      *
//      * @param  array  $segments
//      * @return string
//      */
//     protected  wrapSegments($segments)
//     {
//         return collect($segments)->map(function ($segment, $key) use ($segments) {
//             return $key == 0 && count($segments) > 1
//                             ? this.wrapTable($segment)
//                             : this.wrapValue($segment);
//         })->implode('.');
//     }
//     /**
//      * Wrap a single string in keyword identifiers.
//      *
//      * @param  string  $value
//      * @return string
//      */
//     protected  wrapValue($value) {
//         if ($value !== '*') {
//             return '"'.str_replace('"', '""', $value).'"';
//         }
//         return $value;
//     }
//     /**
//      * Convert an array of column names into a delimited string.
//      *
//      * @param  array   $columns
//      * @return string
//      */
//     columnize(columns: Array<any>) {
//         return implode(', ', array_map([$this, 'wrap'], $columns));
//     }
//     /**
//      * Create query parameter place-holders for an array.
//      *
//      * @param  array   $values
//      * @return string
//      */
//     parameterize(values: Array<any>) {
//         return implode(', ', array_map([$this, 'parameter'], $values));
//     }
//     /**
//      * Get the appropriate query parameter place-holder for a value.
//      *
//      * @param  mixed   $value
//      * @return string
//      */
//     parameter($value) {
//         return this.isExpression($value) ? this.getValue($value) : '?';
//     }
//     /**
//      * Quote the given string literal.
//      *
//      * @param  string|array  $value
//      * @return string
//      */
//     quoteString($value)
//     {
//         if (is_array($value)) {
//             return implode(', ', array_map([$this, __FUNCTION__], $value));
//         }
//         return "'$value'";
//     }
//     /**
//      * Determine if the given value is a raw expression.
//      *
//      * @param  mixed  $value
//      * @return bool
//      */
//     isExpression($value)
//     {
//         return $value instanceof Expression;
//     }
//     /**
//      * Get the value of a raw expression.
//      *
//      * @param  \Illuminate\Database\Query\Expression  $expression
//      * @return string
//      */
//     getValue($expression)
//     {
//         return $expression->getValue();
//     }
//     /**
//      * Get the format for database stored dates.
//      *
//      * @return string
//      */
//     getDateFormat()
//     {
//         return 'Y-m-d H:i:s';
//     }
//     /**
//      * Get the grammar's table prefix.
//      *
//      * @return string
//      */
//     getTablePrefix()
//     {
//         return this.tablePrefix;
//     }
//     /**
//      * Set the grammar's table prefix.
//      *
//      * @param  string  $prefix
//      * @return $this
//      */
//     setTablePrefix($prefix)
//     {
//         this.tablePrefix = $prefix;
//         return $this;
//     }
// }
// class Grammar extends BaseGrammar {
//     /**
//      * The grammar specific operators.
//      *
//      * @var array
//      */
//     protected $operators = [];
//     /**
//      * The components that make up a select clause.
//      *
//      * @var array
//      */
//     protected $selectComponents = [
//         'aggregate',
//         'columns',
//         'from',
//         'joins',
//         'wheres',
//         'groups',
//         'havings',
//         'orders',
//         'limit',
//         'offset',
//         'unions',
//         'lock',
//     ];
//     /**
//      * Compile a select query into SQL.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @return string
//      */
//     compileSelect(Builder $query)
//     {
//         // If the query does not have any columns set, we'll set the columns to the
//         // * character to just get all of the columns from the database. Then we
//         // can build the query and concatenate all the pieces together as one.
//         $original = $query->columns;
//         if (is_null($query->columns)) {
//             $query->columns = ['*'];
//         }
//         // To compile the query, we'll spin through each component of the query and
//         // see if that component exists. If it does we'll just call the compiler
//         // function for the component which is responsible for making the SQL.
//         $sql = trim(this.concatenate(
//             this.compileComponents($query))
//         );
//         $query->columns = $original;
//         return $sql;
//     }
//     /**
//      * Compile the components necessary for a select clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @return array
//      */
//     protected  compileComponents(Builder $query)
//     {
//         $sql = [];
//         foreach (this.selectComponents as $component) {
//             // To compile the query, we'll spin through each component of the query and
//             // see if that component exists. If it does we'll just call the compiler
//             // function for the component which is responsible for making the SQL.
//             if (! is_null($query->$component)) {
//                 $method = 'compile'.ucfirst($component);
//                 $sql[$component] = this.method($query, $query->$component);
//             }
//         }
//         return $sql;
//     }
//     /**
//      * Compile an aggregated select clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $aggregate
//      * @return string
//      */
//     protected  compileAggregate(Builder $query, $aggregate)
//     {
//         $column = this.columnize($aggregate['columns']);
//         // If the query has a "distinct" constraint and we're not asking for all columns
//         // we need to prepend "distinct" onto the column name so that the query takes
//         // it into account when it performs the aggregating operations on the data.
//         if ($query->distinct && $column !== '*') {
//             $column = 'distinct '.$column;
//         }
//         return 'select '.$aggregate['function'].'('.$column.') as aggregate';
//     }
//     /**
//      * Compile the "select *" portion of the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $columns
//      * @return string|null
//      */
//     protected  compileColumns(Builder $query, $columns)
//     {
//         // If the query is actually performing an aggregating select, we will let that
//         // compiler handle the building of the select clauses, as it will need some
//         // more syntax that is best handled by that function to keep things neat.
//         if (! is_null($query->aggregate)) {
//             return;
//         }
//         $select = $query->distinct ? 'select distinct ' : 'select ';
//         return $select.this.columnize($columns);
//     }
//     /**
//      * Compile the "from" portion of the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  string  $table
//      * @return string
//      */
//     protected  compileFrom(Builder $query, $table)
//     {
//         return 'from '.this.wrapTable($table);
//     }
//     /**
//      * Compile the "join" portions of the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $joins
//      * @return string
//      */
//     protected  compileJoins(Builder $query, $joins)
//     {
//         return collect($joins)->map(function ($join) use ($query) {
//             $table = this.wrapTable($join->table);
//             $nestedJoins = is_null($join->joins) ? '' : ' '.this.compileJoins($query, $join->joins);
//             return trim("{$join->type} join {$table}{$nestedJoins} {this.compileWheres($join)}");
//         })->implode(' ');
//     }
//     /**
//      * Compile the "where" portions of the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @return string
//      */
//     protected  compileWheres(Builder $query)
//     {
//         // Each type of where clauses has its own compiler function which is responsible
//         // for actually creating the where clauses SQL. This helps keep the code nice
//         // and maintainable since each clause has a very small method that it uses.
//         if (is_null($query->wheres)) {
//             return '';
//         }
//         // If we actually have some where clauses, we will strip off the first boolean
//         // operator, which is added by the query builders for convenience so we can
//         // avoid checking for the first clauses in each of the compilers methods.
//         if (count($sql = this.compileWheresToArray($query)) > 0) {
//             return this.concatenateWhereClauses($query, $sql);
//         }
//         return '';
//     }
//     /**
//      * Get an array of all the where clauses for the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @return array
//      */
//     protected  compileWheresToArray($query)
//     {
//         return collect($query->wheres)->map(function ($where) use ($query) {
//             return $where['boolean'].' '.this.where{$where['type']}"}($query, $where);
//         })->all();
//     }
//     /**
//      * Format the where clause statements into one string.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $sql
//      * @return string
//      */
//     protected  concatenateWhereClauses($query, $sql)
//     {
//         $conjunction = $query instanceof JoinClause ? 'on' : 'where';
//         return $conjunction.' '.this.removeLeadingBoolean(implode(' ', $sql));
//     }
//     /**
//      * Compile a raw where clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereRaw(Builder $query, $where)
//     {
//         return $where['sql'];
//     }
//     /**
//      * Compile a basic where clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereBasic(Builder $query, $where)
//     {
//         $value = this.parameter($where['value']);
//         return this.wrap($where['column']).' '.$where['operator'].' '.$value;
//     }
//     /**
//      * Compile a "where in" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereIn(Builder $query, $where)
//     {
//         if (! empty($where['values'])) {
//             return this.wrap($where['column']).' in ('.this.parameterize($where['values']).')';
//         }
//         return '0 = 1';
//     }
//     /**
//      * Compile a "where not in" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereNotIn(Builder $query, $where)
//     {
//         if (! empty($where['values'])) {
//             return this.wrap($where['column']).' not in ('.this.parameterize($where['values']).')';
//         }
//         return '1 = 1';
//     }
//     /**
//      * Compile a where in sub-select clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereInSub(Builder $query, $where)
//     {
//         return this.wrap($where['column']).' in ('.this.compileSelect($where['query']).')';
//     }
//     /**
//      * Compile a where not in sub-select clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereNotInSub(Builder $query, $where)
//     {
//         return this.wrap($where['column']).' not in ('.this.compileSelect($where['query']).')';
//     }
//     /**
//      * Compile a "where null" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereNull(Builder $query, $where)
//     {
//         return this.wrap($where['column']).' is null';
//     }
//     /**
//      * Compile a "where not null" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereNotNull(Builder $query, $where)
//     {
//         return this.wrap($where['column']).' is not null';
//     }
//     /**
//      * Compile a "between" where clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereBetween(Builder $query, $where)
//     {
//         $between = $where['not'] ? 'not between' : 'between';
//         $min = this.parameter(reset($where['values']));
//         $max = this.parameter(end($where['values']));
//         return this.wrap($where['column']).' '.$between.' '.$min.' and '.$max;
//     }
//     /**
//      * Compile a "where date" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereDate(Builder $query, $where)
//     {
//         return this.dateBasedWhere('date', $query, $where);
//     }
//     /**
//      * Compile a "where time" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereTime(Builder $query, $where)
//     {
//         return this.dateBasedWhere('time', $query, $where);
//     }
//     /**
//      * Compile a "where day" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereDay(Builder $query, $where)
//     {
//         return this.dateBasedWhere('day', $query, $where);
//     }
//     /**
//      * Compile a "where month" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereMonth(Builder $query, $where)
//     {
//         return this.dateBasedWhere('month', $query, $where);
//     }
//     /**
//      * Compile a "where year" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereYear(Builder $query, $where)
//     {
//         return this.dateBasedWhere('year', $query, $where);
//     }
//     /**
//      * Compile a date based where clause.
//      *
//      * @param  string  $type
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  dateBasedWhere($type, Builder $query, $where)
//     {
//         $value = this.parameter($where['value']);
//         return $type.'('.this.wrap($where['column']).') '.$where['operator'].' '.$value;
//     }
//     /**
//      * Compile a where clause comparing two columns..
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereColumn(Builder $query, $where)
//     {
//         return this.wrap($where['first']).' '.$where['operator'].' '.this.wrap($where['second']);
//     }
//     /**
//      * Compile a nested where clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereNested(Builder $query, $where)
//     {
//         // Here we will calculate what portion of the string we need to remove. If this
//         // is a join clause query, we need to remove the "on" portion of the SQL and
//         // if it is a normal query we need to take the leading "where" of queries.
//         $offset = $query instanceof JoinClause ? 3 : 6;
//         return '('.substr(this.compileWheres($where['query']), $offset).')';
//     }
//     /**
//      * Compile a where condition with a sub-select.
//      *
//      * @param  \Illuminate\Database\Query\Builder $query
//      * @param  array   $where
//      * @return string
//      */
//     protected  whereSub(Builder $query, $where)
//     {
//         $select = this.compileSelect($where['query']);
//         return this.wrap($where['column']).' '.$where['operator']." ($select)";
//     }
//     /**
//      * Compile a where exists clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereExists(Builder $query, $where)
//     {
//         return 'exists ('.this.compileSelect($where['query']).')';
//     }
//     /**
//      * Compile a where exists clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereNotExists(Builder $query, $where)
//     {
//         return 'not exists ('.this.compileSelect($where['query']).')';
//     }
//     /**
//      * Compile a where row values condition.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereRowValues(Builder $query, $where)
//     {
//         $columns = this.columnize($where['columns']);
//         $values = this.parameterize($where['values']);
//         return '('.$columns.') '.$where['operator'].' ('.$values.')';
//     }
//     /**
//      * Compile a "where JSON contains" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereJsonContains(Builder $query, $where)
//     {
//         $not = $where['not'] ? 'not ' : '';
//         return $not.this.compileJsonContains(
//             $where['column'], this.parameter($where['value'])
//         );
//     }
//     /**
//      * Compile a "JSON contains" statement into SQL.
//      *
//      * @param  string  $column
//      * @param  string  $value
//      * @return string
//      *
//      * @throws \RuntimeException
//      */
//     protected  compileJsonContains($column, $value)
//     {
//         throw new RuntimeException('This database engine does not support JSON contains operations.');
//     }

//     /**
//      * Prepare the binding for a "JSON contains" statement.
//      *
//      * @param  mixed  $binding
//      * @return string
//      */
//     prepareBindingForJsonContains($binding)
//     {
//         return json_encode($binding);
//     }

//     /**
//      * Compile a "where JSON length" clause.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $where
//      * @return string
//      */
//     protected  whereJsonLength(Builder $query, $where)
//     {
//         return this.compileJsonLength(
//             $where['column'], $where['operator'], this.parameter($where['value'])
//         );
//     }

//     /**
//      * Compile a "JSON length" statement into SQL.
//      *
//      * @param  string  $column
//      * @param  string  $operator
//      * @param  string  $value
//      * @return string
//      *
//      * @throws \RuntimeException
//      */
//     protected  compileJsonLength($column, $operator, $value)
//     {
//         throw new RuntimeException('This database engine does not support JSON length operations.');
//     }

//     /**
//      * Compile the "group by" portions of the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $groups
//      * @return string
//      */
//     protected  compileGroups(Builder $query, $groups)
//     {
//         return 'group by '.this.columnize($groups);
//     }

//     /**
//      * Compile the "having" portions of the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $havings
//      * @return string
//      */
//     protected  compileHavings(Builder $query, $havings)
//     {
//         $sql = implode(' ', array_map([$this, 'compileHaving'], $havings));

//         return 'having '.this.removeLeadingBoolean($sql);
//     }

//     /**
//      * Compile a single having clause.
//      *
//      * @param  array   $having
//      * @return string
//      */
//     protected  compileHaving(having: Array<any>)
//     {
//         // If the having clause is "raw", we can just return the clause straight away
//         // without doing any more processing on it. Otherwise, we will compile the
//         // clause into SQL based on the components that make it up from builder.
//         if ($having['type'] === 'Raw') {
//             return $having['boolean'].' '.$having['sql'];
//         }

//         return this.compileBasicHaving($having);
//     }

//     /**
//      * Compile a basic having clause.
//      *
//      * @param  array   $having
//      * @return string
//      */
//     protected  compileBasicHaving($having)
//     {
//         $column = this.wrap($having['column']);

//         $parameter = this.parameter($having['value']);

//         return $having['boolean'].' '.$column.' '.$having['operator'].' '.$parameter;
//     }

//     /**
//      * Compile the "order by" portions of the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $orders
//      * @return string
//      */
//     protected  compileOrders(Builder $query, $orders)
//     {
//         if (! empty($orders)) {
//             return 'order by '.implode(', ', this.compileOrdersToArray($query, $orders));
//         }
//         return '';
//     }
//     /**
//      * Compile the query orders to an array.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $orders
//      * @return array
//      */
//     protected  compileOrdersToArray(Builder $query, $orders)
//     {
//         return array_map(function ($order) {
//             return ! isset($order['sql'])
//                         ? this.wrap($order['column']).' '.$order['direction']
//                         : $order['sql'];
//         }, $orders);
//     }
//     /**
//      * Compile the random statement into SQL.
//      *
//      * @param  string  $seed
//      * @return string
//      */
//     compileRandom($seed)
//     {
//         return 'RANDOM()';
//     }
//     /**
//      * Compile the "limit" portions of the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  int  $limit
//      * @return string
//      */
//     protected  compileLimit(Builder $query, $limit)
//     {
//         return 'limit '.(int) $limit;
//     }
//     /**
//      * Compile the "offset" portions of the query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  int  $offset
//      * @return string
//      */
//     protected  compileOffset(Builder $query, $offset)
//     {
//         return 'offset '.(int) $offset;
//     }
//     /**
//      * Compile the "union" queries attached to the main query.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @return string
//      */
//     protected  compileUnions(Builder $query)
//     {
//         $sql = '';
//         foreach ($query->unions as $union) {
//             $sql .= this.compileUnion($union);
//         }
//         if (! empty($query->unionOrders)) {
//             $sql .= ' '.this.compileOrders($query, $query->unionOrders);
//         }
//         if (isset($query->unionLimit)) {
//             $sql .= ' '.this.compileLimit($query, $query->unionLimit);
//         }
//         if (isset($query->unionOffset)) {
//             $sql .= ' '.this.compileOffset($query, $query->unionOffset);
//         }
//         return ltrim($sql);
//     }
//     /**
//      * Compile a single union statement.
//      *
//      * @param  array  $union
//      * @return string
//      */
//     protected  compileUnion(union: Array<any>)
//     {
//         $conjunction = $union['all'] ? ' union all ' : ' union ';
//         return $conjunction.$union['query']->toSql();
//     }
//     /**
//      * Compile an exists statement into SQL.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @return string
//      */
//     compileExists(Builder $query)
//     {
//         $select = this.compileSelect($query);
//         return "select exists({$select}) as {this.wrap('exists')}";
//     }
//     /**
//      * Compile an insert statement into SQL.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $values
//      * @return string
//      */
//     compileInsert(Builder $query, array $values)
//     {
//         // Essentially we will force every insert to be treated as a batch insert which
//         // simply makes creating the SQL easier for us since we can utilize the same
//         // basic routine regardless of an amount of records given to us to insert.
//         $table = this.wrapTable($query->from);
//         if (! is_array(reset($values))) {
//             $values = [$values];
//         }
//         $columns = this.columnize(array_keys(reset($values)));
//         // We need to build a list of parameter place-holders of values that are bound
//         // to the query. Each insert should have the exact same amount of parameter
//         // bindings so we will loop through the record and parameterize them all.
//         $parameters = collect($values)->map(function ($record) {
//             return '('.this.parameterize($record).')';
//         })->implode(', ');
//         return "insert into $table ($columns) values $parameters";
//     }
//     /**
//      * Compile an insert and get ID statement into SQL.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array   $values
//      * @param  string  $sequence
//      * @return string
//      */
//     compileInsertGetId(Builder $query, $values, $sequence)
//     {
//         return this.compileInsert($query, $values);
//     }
//     /**
//      * Compile an update statement into SQL.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  array  $values
//      * @return string
//      */
//     compileUpdate(Builder $query, $values)
//     {
//         $table = this.wrapTable($query->from);
//         // Each one of the columns in the update statements needs to be wrapped in the
//         // keyword identifiers, also a place-holder needs to be created for each of
//         // the values in the list of bindings so we can make the sets statements.
//         $columns = collect($values)->map(function ($value, $key) {
//             return this.wrap($key).' = '.this.parameter($value);
//         })->implode(', ');
//         // If the query has any "join" clauses, we will setup the joins on the builder
//         // and compile them so we can attach them to this update, as update queries
//         // can get join statements to attach to other tables when they're needed.
//         $joins = '';
//         if (isset($query->joins)) {
//             $joins = ' '.this.compileJoins($query, $query->joins);
//         }
//         // Of course, update queries may also be constrained by where clauses so we'll
//         // need to compile the where clauses and attach it to the query so only the
//         // intended records are updated by the SQL statements we generate to run.
//         $wheres = this.compileWheres($query);
//         return trim("update {$table}{$joins} set $columns $wheres");
//     }
//     /**
//      * Prepare the bindings for an update statement.
//      *
//      * @param  array  $bindings
//      * @param  array  $values
//      * @return array
//      */
//     prepareBindingsForUpdate(bindings: Array<any>, array $values)
//     {
//         $cleanBindings = Arr::except($bindings, ['join', 'select']);
//         return array_values(
//             array_merge($bindings['join'], $values, Arr::flatten($cleanBindings))
//         );
//     }
//     /**
//      * Compile a delete statement into SQL.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @return string
//      */
//     compileDelete(Builder $query)
//     {
//         $wheres = is_array($query->wheres) ? this.compileWheres($query) : '';
//         return trim("delete from {this.wrapTable($query->from)} $wheres");
//     }
//     /**
//      * Prepare the bindings for a delete statement.
//      *
//      * @param  array  $bindings
//      * @return array
//      */
//     prepareBindingsForDelete(bindings: Array<any>)
//     {
//         return Arr::flatten($bindings);
//     }
//     /**
//      * Compile a truncate table statement into SQL.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @return array
//      */
//     compileTruncate(Builder $query)
//     {
//         return ['truncate '.this.wrapTable($query->from) => []];
//     }
//     /**
//      * Compile the lock into SQL.
//      *
//      * @param  \Illuminate\Database\Query\Builder  $query
//      * @param  bool|string  $value
//      * @return string
//      */
//     protected  compileLock(Builder $query, $value)
//     {
//         return is_string($value) ? $value : '';
//     }
//     /**
//      * Determine if the grammar supports savepoints.
//      *
//      * @return bool
//      */
//     supportsSavepoints()
//     {
//         return true;
//     }
//     /**
//      * Compile the SQL statement to define a savepoint.
//      *
//      * @param  string  $name
//      * @return string
//      */
//     compileSavepoint($name)
//     {
//         return 'SAVEPOINT '.$name;
//     }
//     /**
//      * Compile the SQL statement to execute a savepoint rollback.
//      *
//      * @param  string  $name
//      * @return string
//      */
//     compileSavepointRollBack($name)
//     {
//         return 'ROLLBACK TO SAVEPOINT '.$name;
//     }
//     /**
//      * Wrap a value in keyword identifiers.
//      *
//      * @param  \Illuminate\Database\Query\Expression|string  $value
//      * @param  bool    $prefixAlias
//      * @return string
//      */
//     wrap($value, $prefixAlias = false)
//     {
//         if (this.isExpression($value)) {
//             return this.getValue($value);
//         }
//         // If the value being wrapped has a column alias we will need to separate out
//         // the pieces so we can wrap each of the segments of the expression on its
//         // own, and then join these both back together using the "as" connector.
//         if (stripos($value, ' as ') !== false) {
//             return this.wrapAliasedValue($value, $prefixAlias);
//         }
//         // If the given value is a JSON selector we will wrap it differently than a
//         // traditional value. We will need to split this path and wrap each part
//         // wrapped, etc. Otherwise, we will simply wrap the value as a string.
//         if (this.isJsonSelector($value)) {
//             return this.wrapJsonSelector($value);
//         }
//         return this.wrapSegments(explode('.', $value));
//     }
//     /**
//      * Wrap the given JSON selector.
//      *
//      * @param  string  $value
//      * @return string
//      */
//     protected  wrapJsonSelector($value)
//     {
//         throw new RuntimeException('This database engine does not support JSON operations.');
//     }
//     /**
//      * Split the given JSON selector into the field and the optional path and wrap them separately.
//      *
//      * @param  string  $column
//      * @return array
//      */
//     protected  wrapJsonFieldAndPath($column)
//     {
//         $parts = explode('->', $column, 2);
//         $field = this.wrap($parts[0]);
//         $path = count($parts) > 1 ? ', '.this.wrapJsonPath($parts[1]) : '';
//         return [$field, $path];
//     }
//     /**
//      * Wrap the given JSON path.
//      *
//      * @param  string  $value
//      * @return string
//      */
//     protected  wrapJsonPath($value)
//     {
//         return '\'$."'.str_replace('->', '"."', $value).'"\'';
//     }
//     /**
//      * Determine if the given string is a JSON selector.
//      *
//      * @param  string  $value
//      * @return bool
//      */
//     protected  isJsonSelector($value)
//     {
//         return Str::contains($value, '->');
//     }
//     /**
//      * Concatenate an array of segments, removing empties.
//      *
//      * @param  array   $segments
//      * @return string
//      */
//     protected  concatenate($segments)
//     {
//         return implode(' ', array_filter($segments, function ($value) {
//             return (string) $value !== '';
//         }));
//     }
//     /**
//      * Remove the leading boolean from a statement.
//      *
//      * @param  string  $value
//      * @return string
//      */
//     protected  removeLeadingBoolean($value)
//     {
//         return preg_replace('/and |or /i', '', $value, 1);
//     }
//     /**
//      * Get the grammar specific operators.
//      *
//      * @return array
//      */
//     getOperators()
//     {
//         return this.operators;
//     }
// }
