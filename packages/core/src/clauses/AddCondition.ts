import {
  TAndOr,
  TNot,
  TColumnArg,
  TValueArg,
  SubQueryArg,
  TConditionNode,
  TValueConditions,
  TSubQueryNode,
  TValue,
  TColumn,
  TQueryArg,
  TOperatorArg,
  TInValue,
  TInArg,
  SubConditionFn,
  TDateCondArgs,
  TAliasedIdentNode,
  TRawNode,
  TColumnVal,
} from "../data/types";
import {
  CondNullNode,
  ConditionExpressionNode,
  CondExistsNode,
  SubQueryNode,
  CondInNode,
  CondBetweenNode,
  CondRawNode,
  CondDateNode,
  CondColumnNode,
  RawNode,
} from "../data/structs";
import { DateCondType, ClauseTypeEnum, OperatorEnum } from "../data/enums";
import { isRawNode, isSelectBuilder } from "../data/predicates";
import { Grammar } from "../Grammar";
import { Record, List } from "immutable";
import invariant from "invariant";
import { isInOrBetween } from "../data/regexes";

/**
 * Most of the clause conditions (having, where, join) are similarly shaped
 * This provides the methods shared by each.
 */
export abstract class AddCondition {
  protected abstract ast: Record<any> | List<TConditionNode>;

  protected abstract grammar: Grammar;

  /**
   * Handles the basic condition case:
   *
   * "column" = value
   *
   * creates a wrapped context if necessary, otherwise
   */
  protected addCond(
    clauseType: ClauseTypeEnum,
    args: any[],
    andOr: TAndOr,
    not: TNot = null,
    asCol: boolean = false
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
        const newNot = isNot ? (not ? null : OperatorEnum.NOT) : OperatorEnum.NOT;
        if (inOrBetween.toUpperCase() === "IN") {
          return this.addInCond(clauseType, args[0], args[2], andOr, newNot);
        }
        return this.addBetweenCond(clauseType, args[0], args[2], andOr, newNot);
      }
    }
    return this;
  }

  protected addCondAry1(asCol: boolean, clauseType: ClauseTypeEnum, arg: any, andOr: TAndOr, not: TNot = null) {
    if (typeof arg === "function") {
      return this.subCondition(clauseType, arg, andOr, not);
    }
    // WHERE true or WHERE 1
    if (typeof arg === "boolean" || typeof arg === "number") {
      return this.addCond(clauseType, [1, "=", arg ? 1 : 0], andOr, not);
    }
    // Array / array-like, create a wrapped context with each of the conditions
    if (Array.isArray(arg)) {
      return this.subCondition(
        clauseType,
        qb => {
          (arg as TValueConditions).forEach(cond => {
            qb.addCond(clauseType, cond, OperatorEnum.AND, null, asCol);
          });
        },
        andOr,
        not
      );
    }
    if (isRawNode(arg)) {
      return this.pushCondition(clauseType, CondRawNode({ value: arg }));
    }
    // Handles the { column: value } syntax
    if (typeof arg === "object" && arg !== null) {
      return this.subCondition(
        clauseType,
        qb => {
          Object.keys(arg).forEach(col => {
            if (asCol) {
              qb.addColumnCondNode(clauseType, col, "=", arg[col], OperatorEnum.AND);
            } else {
              qb.addExpressionCondNode(clauseType, col, "=", arg[col], OperatorEnum.AND);
            }
          });
        },
        andOr,
        not
      );
    }
    return this;
  }

  /**
   * Handles the column to column comparison condition, e.g.:
   *
   * "column" >= "otherColumn"
   */
  protected addColumnCond(clauseType: ClauseTypeEnum, args: any[], andOr: TAndOr, not: TNot = null): this {
    return this.addCond(clauseType, args, andOr, not, true);
  }

  protected addColumnCondNode(
    clauseType: ClauseTypeEnum,
    column: TColumnArg,
    operator: TOperatorArg,
    rightColumn: TColumnArg,
    andOr: TAndOr,
    not: TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      CondColumnNode({
        not,
        andOr,
        column: this.unwrapIdent(column),
        operator: operator,
        rightColumn: this.unwrapIdent(rightColumn),
      })
    );
  }

  protected addExpressionCondNode(
    clauseType: ClauseTypeEnum,
    column: TColumnArg,
    operator: TOperatorArg,
    val: TValueArg,
    andOr: TAndOr,
    not: TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      ConditionExpressionNode({
        not,
        andOr,
        column: this.unwrapIdent(column),
        operator,
        value: this.unwrapValue(val),
      })
    );
  }

  protected addInCond(clauseType: ClauseTypeEnum, column: TColumnArg, arg: TInArg, andOr: TAndOr, not: TNot = null) {
    return this.pushCondition(
      clauseType,
      CondInNode({
        andOr,
        not,
        column: this.unwrapIdent(column),
        value: this.unwrapInValue(arg),
      })
    );
  }

  protected addNullCond(clauseType: ClauseTypeEnum, column: TColumnArg, andOr: TAndOr, not: TNot = null) {
    return this.pushCondition(
      clauseType,
      CondNullNode({
        andOr,
        not,
        column: this.unwrapIdent(column),
      })
    );
  }

  protected addExistsCond(clauseType: ClauseTypeEnum, query: TQueryArg, andOr: TAndOr, not: TNot = null) {
    return this.pushCondition(
      clauseType,
      CondExistsNode({
        andOr,
        not,
        column: this.unwrapIdent(query),
      })
    );
  }

  protected addBetweenCond(
    clauseType: ClauseTypeEnum,
    column: TColumnArg,
    args: [TValueArg, TValueArg],
    andOr: TAndOr,
    not: TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      CondBetweenNode({
        andOr,
        not,
        column: this.unwrapIdent(column),
        first: this.unwrapValue(args[0]),
        second: this.unwrapValue(args[1]),
      })
    );
  }

  protected addDateCond(
    clauseType: ClauseTypeEnum,
    dateType: DateCondType,
    column: TColumnArg,
    op: string | TRawNode,
    value: TValueArg,
    andOr: TAndOr,
    not: TNot = null
  ): this {
    return this.pushCondition(
      clauseType,
      CondDateNode({
        type: dateType,
        column: this.unwrapIdent(column),
        operator: op,
        value: this.unwrapValue(value),
        andOr,
        not,
      })
    );
  }

  protected unwrapIdentArr(column: TColumnArg[]): TColumn[] {
    return column.map(col => this.unwrapIdent(col));
  }

  /**
   * Takes an argument in a "column" slot and unwraps it so any subqueries / raw values
   * are properly handled.
   */
  protected unwrapIdent(column: TColumnArg): TColumn {
    if (typeof column === "string") {
      return this.unwrapAlias(column);
    }
    return this.unwrapIdentVal(column);
  }

  /**
   * Takes a column/table reference in a "value" slot and unwraps it
   */
  protected unwrapIdentVal(column: TColumnArg): TColumnVal {
    if (typeof column === "function") {
      return this.subQuery(column);
    }
    if (typeof column === "number") {
      return RawNode({
        fragments: List([`${column}`]),
      });
    }
    if (isRawNode(column)) {
      return column;
    }
    if (isSelectBuilder(column)) {
      return SubQueryNode({ ast: column.getAst() });
    }
    console.log(column);
    throw new Error(`Invalid column type provided to the query builder: ${typeof column}`);
  }

  protected unwrapAlias(column: string): string | TAliasedIdentNode {
    return column;
  }

  /**
   * Takes an argument in a "value" slot and unwraps it so any subqueries / raw values
   * are properly handled.
   */
  protected unwrapValue(value: TValueArg): TValue {
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
      return SubQueryNode({ ast: value.getAst() });
    }
    console.log(value);
    throw new Error(`Invalid value provided to the query builder: ${typeof value}`);
  }

  protected unwrapInValue(value: TInArg): TInValue {
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
      return SubQueryNode({ ast: value.getAst() });
    }
    console.log(value);
    throw new Error(`Invalid value provided to the where in builder: ${typeof value}`);
  }

  protected normalizeExprArgs(args: TDateCondArgs): [TColumnArg, TOperatorArg, TValueArg] {
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
  protected abstract subCondition(clauseType: ClauseTypeEnum, fn: SubConditionFn, andOr: TAndOr, not: TNot): this;

  /**
   * Adds a node to the AST based on the appropriate clauseType
   */
  protected abstract pushCondition(clauseType: ClauseTypeEnum, node: TConditionNode): this;

  /**
   * Creates a sub-query. Used whenever a function is passed in the place of a column or value.
   */
  protected abstract subQuery(fn: SubQueryArg): TSubQueryNode;

  /**
   * Get the AST of the conditions.
   */
  protected abstract getAst(): AddCondition["ast"];
}
