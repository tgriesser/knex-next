import {
  TAndOr,
  TNot,
  TColumnArg,
  TOperator,
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
} from "../data/structs";
import { DateCondType, ClauseTypeEnum, OperatorEnum } from "../data/enums";
import { isRawNode, isSelectBuilder } from "@knex/core/src/data/predicates";
import { Grammar } from "@knex/core/src/Grammar";
import { Record, List } from "immutable";

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
        return this.addCondAry3(clauseType, args[0], args[1], args[2], andOr, not);
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
    if (isRawNode(arg)) {
      return this.pushCondition(clauseType, CondRawNode({ value: arg }));
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

  protected addCondAry3(
    clauseType: ClauseTypeEnum,
    column: TColumnArg,
    op: TOperatorArg,
    value: TValueArg,
    andOr: TAndOr,
    not: TNot = null
  ) {
    return this.pushCondition(
      clauseType,
      ConditionExpressionNode({
        not,
        andOr,
        column: this.unwrapColumn(column),
        operator: this.checkOperator(op),
        value: this.unwrapValue(value),
      })
    );
  }

  /**
   * Handles the column to column comparison condition, e.g.:
   *
   * "column" >= "otherColumn"
   */
  protected addColumnCond(clauseType: ClauseTypeEnum, args: any[], andOr: TAndOr, not: TNot = null) {
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
        column: this.unwrapColumn(column),
        operator,
        value: this.unwrapValue(val),
      })
    );
  }

  protected checkOperator(op: TOperatorArg): TOperator {
    if (this.grammar.checkOperator(op as TOperator)) {
      throw new Error(`Invalid operator ${op} passed to query expression.`);
    }
    return op as TOperator;
  }

  protected addInCond(clauseType: ClauseTypeEnum, column: TColumnArg, arg: TInArg, andOr: TAndOr, not: TNot = null) {
    return this.pushCondition(
      clauseType,
      CondInNode({
        andOr,
        not,
        column: this.unwrapColumn(column),
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
        column: this.unwrapColumn(column),
      })
    );
  }

  protected addExistsCond(clauseType: ClauseTypeEnum, query: TQueryArg, andOr: TAndOr, not: TNot = null) {
    return this.pushCondition(
      clauseType,
      CondExistsNode({
        andOr,
        not,
        column: this.unwrapColumn(query),
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
        column: this.unwrapColumn(column),
        first: this.unwrapValue(args[0]),
        second: this.unwrapValue(args[1]),
      })
    );
  }

  protected addDateCond(
    clauseType: ClauseTypeEnum,
    dateType: DateCondType,
    column: TColumnArg,
    op: TOperatorArg,
    value: TValueArg,
    andOr: TAndOr,
    not: TNot = null
  ): this {
    return this.pushCondition(
      clauseType,
      CondDateNode({
        type: dateType,
        column: this.unwrapColumn(column),
        operator: this.checkOperator(op),
        value: this.unwrapValue(value),
        andOr,
        not,
      })
    );
  }

  /**
   * Takes an argument in a "column" slot and unwraps it so any subqueries, are performed, etc.
   */
  protected unwrapColumn(column: TColumnArg): TColumn {
    if (typeof column === "function") {
      return this.subQuery(column);
    }
    if (typeof column === "string" || typeof column === "number") {
      return column;
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

  /**
   * Takes an argument in a "value" slot and unwraps it so any subqueries, are performed, etc.
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
