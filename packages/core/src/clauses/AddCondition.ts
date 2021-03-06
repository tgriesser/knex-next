import { isRawNode, isSelectBuilder } from "../data/predicates";
import { Grammar } from "../Grammar";
import { Record, List } from "immutable";
import invariant from "invariant";
import { isInOrBetween, extractAlias } from "../data/regexes";
import { Types, Structs, Enums } from "../data";

/**
 * Most of the clause conditions (having, where, join) are similarly shaped
 * This provides the methods shared by each.
 */
export abstract class AddCondition {
  protected abstract ast: Record<any> | List<Types.TConditionNode>;

  protected abstract grammar: Grammar;

  /**
   * Handles the basic condition case:
   *
   * "column" = value
   *
   * creates a wrapped context if necessary, otherwise
   */
  protected addValueCond(
    clauseType: Enums.ClauseTypeEnum,
    args: Types.TConditionValueArgs<Types.TWhereBuilderFn | Types.THavingBuilderFn>,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    return this.addCond(false, clauseType, args, andOr, not);
  }

  /**
   * Handles the column to column comparison condition, e.g.:
   *
   * "column" >= "otherColumn"
   */
  protected addColumnCond(
    clauseType: Enums.ClauseTypeEnum,
    args: Types.TConditionColumnArgs | Types.TJoinConditionColumnArgs,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ): this {
    return this.addCond(true, clauseType, args, andOr, not);
  }

  /**
   * Handles the basic condition case:
   *
   * "column" = value
   *
   * creates a wrapped context if necessary, otherwise
   */
  protected addCond(
    asCol: boolean,
    clauseType: Enums.ClauseTypeEnum,
    args: any[],
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ): this {
    switch (args.length) {
      case 1: {
        return this.addCondAry1(asCol, clauseType, args[0], andOr, not);
      }
      case 2: {
        if (args[1] === null) {
          return this.addNullCond(clauseType, args[0], andOr, not);
        }
        if (asCol) {
          return this.addColumnCondNode(clauseType, args[0], "=", args[1], andOr, not);
        } else {
          return this.addExpressionCondNode(clauseType, args[0], "=", args[1], andOr, not);
        }
      }
      case 3: {
        const matches = isInOrBetween(args[1]);
        if (matches === null) {
          if (asCol) {
            return this.addColumnCondNode(clauseType, args[0], args[1], args[2], andOr, not);
          } else {
            return this.addExpressionCondNode(clauseType, args[0], args[1], args[2], andOr, not);
          }
        }
        const [, isNot, inOrBetween] = matches;
        const newNot = isNot ? (not ? null : Enums.OperatorEnum.NOT) : Enums.OperatorEnum.NOT;
        if (inOrBetween.toUpperCase() === "IN") {
          return this.addInCond(clauseType, args[0], args[2], andOr, newNot);
        }
        return this.addBetweenCond(clauseType, args[0], args[2], andOr, newNot);
      }
    }
    return this;
  }

  protected addCondAry1(
    asCol: boolean,
    clauseType: Enums.ClauseTypeEnum,
    arg: any,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    if (typeof arg === "function") {
      return this.subCondition(clauseType, arg, andOr, not);
    }
    // WHERE true or WHERE 1
    if (typeof arg === "boolean" || typeof arg === "number") {
      return this.addValueCond(clauseType, [1, "=", arg ? 1 : 0], andOr, not);
    }
    // Array / array-like, create a wrapped context with each of the conditions
    if (Array.isArray(arg)) {
      return this.subCondition(
        clauseType,
        qb => {
          (arg as Types.TValueCondition[]).forEach(cond => {
            qb.addCond(asCol, clauseType, cond, Enums.OperatorEnum.AND, null);
          });
        },
        andOr,
        not
      );
    }
    if (isRawNode(arg)) {
      return this.pushCondition(clauseType, Structs.CondRawNode({ value: arg }));
    }
    // Handles the { column: value } syntax
    if (typeof arg === "object" && arg !== null) {
      return this.subCondition(
        clauseType,
        qb => {
          Object.keys(arg).forEach(col => {
            if (asCol) {
              qb.addColumnCondNode(clauseType, col, "=", arg[col], Enums.OperatorEnum.AND);
            } else {
              qb.addExpressionCondNode(clauseType, col, "=", arg[col], Enums.OperatorEnum.AND);
            }
          });
        },
        andOr,
        not
      );
    }
    return this;
  }

  protected addColumnCondNode(
    clauseType: Enums.ClauseTypeEnum,
    column: Types.TColumnArg,
    operator: Types.TOperatorArg,
    rightColumn: Types.TColumnArg,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      Structs.CondColumnNode({
        not,
        andOr,
        column: this.unwrapIdent(column),
        operator: operator,
        rightColumn: this.unwrapIdent(rightColumn),
      })
    );
  }

  protected addExpressionCondNode(
    clauseType: Enums.ClauseTypeEnum,
    column: Types.TColumnArg,
    operator: Types.TOperatorArg,
    val: Types.TValueArg,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      Structs.ConditionExpressionNode({
        not,
        andOr,
        column: this.unwrapIdent(column),
        operator,
        value: this.unwrapValue(val),
      })
    );
  }

  protected addInCond(
    clauseType: Enums.ClauseTypeEnum,
    column: Types.TColumnArg,
    arg: Types.TInArg,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      Structs.CondInNode({
        andOr,
        not,
        column: this.unwrapIdent(column),
        value: this.unwrapInValue(arg),
      })
    );
  }

  protected addNullCond(
    clauseType: Enums.ClauseTypeEnum,
    column: Types.TColumnArg,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      Structs.CondNullNode({
        andOr,
        not,
        column: this.unwrapIdent(column),
      })
    );
  }

  protected addExistsCond(
    clauseType: Enums.ClauseTypeEnum,
    query: Types.TQueryArg,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      Structs.CondExistsNode({
        andOr,
        not,
        query: this.unwrapSubQuery(query),
      })
    );
  }

  protected addBetweenCond(
    clauseType: Enums.ClauseTypeEnum,
    column: Types.TColumnArg,
    args: [Types.TValueArg, Types.TValueArg],
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      Structs.CondBetweenNode({
        andOr,
        not,
        column: this.unwrapIdent(column),
        first: this.unwrapValue(args[0]),
        second: this.unwrapValue(args[1]),
      })
    );
  }

  protected addDateCond(
    clauseType: Enums.ClauseTypeEnum,
    dateType: Enums.DateCondType,
    column: Types.TColumnArg,
    op: string | Types.TRawNode,
    value: Types.TValueArg,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ): this {
    return this.pushCondition(
      clauseType,
      Structs.CondDateNode({
        type: dateType,
        column: this.unwrapIdent(column),
        operator: op,
        value: this.unwrapValue(value),
        andOr,
        not,
      })
    );
  }

  protected unwrapIdentArr(column: Types.TColumnArg[]): Types.TColumn[] {
    return column.map(col => this.unwrapIdent(col));
  }

  /**
   * Takes an argument in a "column" slot and unwraps it so any subqueries / raw values
   * are properly handled.
   */
  protected unwrapIdent(column: Types.TColumnArg | Types.TQueryArg): Types.TColumn {
    if (typeof column === "string") {
      return this.unwrapAlias(column);
    }
    return this.unwrapIdentVal(column);
  }

  /**
   * Takes a column/table reference in a "value" slot and unwraps it
   */
  protected unwrapIdentVal(column: number | Types.TQueryArg): Types.TColumnVal {
    if (typeof column === "number") {
      return Structs.RawNode({
        fragments: List([`${column}`]),
      });
    }
    return this.unwrapSubQuery(column);
  }

  protected unwrapSubQuery(column: Types.TQueryArg) {
    if (typeof column === "function") {
      return this.subQuery(column);
    }
    if (isRawNode(column)) {
      return column;
    }
    if (isSelectBuilder(column)) {
      return Structs.SubQueryNode({ ast: column.getAst() });
    }
    console.log(column);
    throw new Error(`Invalid column type provided to the query builder: ${typeof column}`);
  }

  protected unwrapAlias(column: string): string | Types.TAliasedIdentNode {
    const aliased = extractAlias(column);
    if (!aliased) {
      return column;
    }
    return Structs.AliasedIdentNode({ ident: aliased[1], alias: aliased[2] });
  }

  /**
   * Takes an argument in a "value" slot and unwraps it so any subqueries / raw values
   * are properly handled.
   */
  protected unwrapValue(value: Types.TValueArg): Types.TValue {
    if (value === null) {
      return value;
    }
    if (typeof value === "function") {
      return this.subQuery(value);
    }
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    if (isRawNode(value)) {
      return value;
    }
    if (isSelectBuilder(value)) {
      return Structs.SubQueryNode({ ast: value.getAst() });
    }
    console.log(value);
    throw new Error(`Invalid value provided to the query builder: ${typeof value}`);
  }

  protected unwrapInValue(value: Types.TInArg): Types.TInValue {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "function") {
      return this.subQuery(value);
    }
    if (isRawNode(value)) {
      return value;
    }
    if (isSelectBuilder(value)) {
      return Structs.SubQueryNode({ ast: value.getAst() });
    }
    console.log(value);
    throw new Error(`Invalid value provided to the where in builder: ${typeof value}`);
  }

  protected normalizeExprArgs(args: Types.TValueCondition): Types.TValueCondition3 {
    if (args.length === 2) {
      return [args[0], "=", args[1]];
    }
    invariant(args.length === 3, "Invalid arguments, expected 2 or 3, saw %s", args.length);
    return args;
  }

  /**
   * Creates a new wrapped condition block, calling the function with the
   * appropriate builder based on the `clauseType`
   */
  protected abstract subCondition(
    clauseType: Enums.ClauseTypeEnum,
    fn: Types.SubConditionFn,
    andOr: Types.TAndOr,
    not: Types.TNot
  ): this;

  /**
   * Adds a node to the AST based on the appropriate clauseType
   */
  protected abstract pushCondition(clauseType: Enums.ClauseTypeEnum, node: Types.TConditionNode): this;

  /**
   * Creates a sub-query. Used whenever a function is passed in the place of a column or value.
   */
  protected abstract subQuery(fn: Types.SubQueryArg): Types.TSubQueryNode;

  /**
   * Get the AST of the conditions.
   */
  protected abstract getAst(): AddCondition["ast"];
}
