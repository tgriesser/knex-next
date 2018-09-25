import {
  TAndOr,
  TNot,
  TColumnArg,
  TOperator,
  TValueArg,
  SubQueryArg,
  TConditionNode,
  TValueConditions,
} from "../data/types";
import { CondNullNode, ConditionExpressionNode, RawNode } from "../data/structs";
import { DateCondType, ClauseTypeEnum, OperatorEnum } from "../data/enums";

interface SubConditionFn {
  (this: AddCondition, qb: AddCondition): any;
}

/**
 * Most of the clause conditions (having, where, join) are similarly shaped
 * This provides the methods shared by each.
 */
export abstract class AddCondition {
  /**
   * Handles the basic condition case:
   *
   * "column" = value
   *
   * creates a wrapped context if necessary, otherwise
   */
  protected addCond(clauseType: ClauseTypeEnum, args: any[], andOr: TAndOr, not: TNot = null): this {
    switch (args.length) {
      case 1: {
        return this.addCondAry1(clauseType, args[0], andOr, not);
      }
      case 2: {
        if (args[1] === null) {
          return this.addNullCond(clauseType, args[0], andOr, not);
        }
        return this.addExpressionCond(clauseType, args[0], "=", args[1], andOr, not);
      }
      case 3: {
        return this.pushCondition(
          clauseType,
          ConditionExpressionNode({
            not,
            andOr,
            column: this.unwrapColumn(args[0]),
          })
        );
      }
    }
    return this;
  }

  protected addCondAry1(clauseType: ClauseTypeEnum, arg: any, andOr: TAndOr, not: TNot = null) {
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
            qb.addCond(clauseType, cond, OperatorEnum.AND);
          });
        },
        andOr,
        not
      );
    }
    // Handles the { column: value } syntax
    if (typeof arg === "object" && arg !== null) {
      return this.subCondition(
        clauseType,
        qb => {
          Object.keys(arg).forEach(col => {
            qb.addExpressionCond(clauseType, col, "=", arg[col], OperatorEnum.AND);
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
  protected addColumnCond(args: any[], andOr: TAndOr, not: TNot = null) {
    switch (args.length) {
      case 1: {
        const arg = args[0];
      }
    }
    return this;
  }

  protected addExpressionCond(
    clauseType: ClauseTypeEnum,
    column: TColumnArg,
    operator: TOperator,
    val: TValueArg,
    andOr: TAndOr,
    not: TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      ConditionExpressionNode({
        not,
        andOr,
        column: unpackColumn(column),
        operator,
        value: unpackValue(val),
      })
    );
  }

  protected checkOperator(op: TOperator) {
    return this;
  }

  protected addInCond(args: [TColumnArg, SubQueryArg] | [TColumnArg, any], andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected addNullCond(clauseType: ClauseTypeEnum, column: TColumnArg, andOr: TAndOr, not: TNot = null) {
    return this.pushCondition(
      clauseType,
      CondNullNode({
        andOr,
        not,
        column: unpackColumn(column),
      })
    );
  }

  protected addExistsCond(clauseType: ClauseTypeEnum, subQuery: SubQueryArg, andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected addBetweenCond(clauseType: ClauseTypeEnum, args: any[], andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected addDateCond(type: DateCondType): this {
    return this;
  }

  /**
   * Takes an argument in a "column" slot and unwraps it so any subqueries, are performed, etc.
   */
  protected unwrapColumn(column: TColumnArg) {}

  /**
   * Takes an argument in a "value" slot and unwraps it so any subqueries, are performed, etc.
   */
  protected unwrapValue() {}

  /**
   * Creates a new wrapped condition block, calling the function with the
   * appropriate builder based on the `clauseType`
   */
  protected abstract subCondition(clauseType: ClauseTypeEnum, fn: SubConditionFn, andOr: TAndOr, not: TNot): this;

  /**
   * Adds a node to the AST based on the appropriate clauseType
   */
  protected abstract pushCondition(clauseType: ClauseTypeEnum, node: TConditionNode): this;
}
