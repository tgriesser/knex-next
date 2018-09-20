import {
  ChainFn,
  TOperator,
  TColumnArg,
  TColumnConditions,
  TAndOr,
  TValueConditions,
  SubQuery,
  ChainFnWhere,
} from "./types";
import { IRawNode, OperatorEnum, whereClauseNode } from "./datatypes";

interface SubWhere {
  (this: WhereClauseBuilder, arg: WhereClauseBuilder): WhereClauseBuilder;
}

export abstract class WhereClauseBuilder {
  where(raw: IRawNode): this;
  where(fn: SubWhere): this;
  where(builder: WhereClauseBuilder): this;
  where(bool: boolean): this;
  where(obj: { [column: string]: any }): this;
  where(column: TColumnArg, value: any): this;
  where(column: TColumnArg, op: TOperator, value: any): this;
  where(conditions: TValueConditions): this;
  where(...args: any[]) {
    return this.addWhere(args, OperatorEnum.AND);
  }
  orWhere(raw: IRawNode): this;
  orWhere(fn: SubWhere): this;
  orWhere(bool: boolean): this;
  orWhere(builder: WhereClauseBuilder): this;
  orWhere(obj: { [column: string]: any }): this;
  orWhere(column: TColumnArg, value: any): this;
  orWhere(column: TColumnArg, op: TOperator, value: any): this;
  orWhere(conditions: TValueConditions): this;
  orWhere(...args: any[]) {
    return this.addWhere(args, OperatorEnum.OR);
  }
  whereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  whereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  whereColumn(obj: { [column: string]: string }): this;
  whereColumn(conditions: TColumnConditions): this;
  whereColumn(...args: any[]) {
    return this.addWhereColumn(args, OperatorEnum.AND);
  }
  orWhereColumn(columnA: TColumnArg, columnB: TColumnArg): this;
  orWhereColumn(columnA: TColumnArg, op: TOperator, columnB: TColumnArg): this;
  orWhereColumn(obj: { [column: string]: string }): this;
  orWhereColumn(conditions: TColumnConditions): this;
  orWhereColumn(...args: any[]) {
    return this.addWhere(args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  whereIn(columnA: TColumnArg, sub: SubQuery): this;
  whereIn(columnA: TColumnArg, values: any[]): this;
  whereIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.AND);
  }
  orWhereIn(columnA: TColumnArg, sub: SubQuery): this;
  orWhereIn(columnA: TColumnArg, values: any[]): this;
  orWhereIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.OR);
  }
  whereNotIn(columnA: TColumnArg, sub: SubQuery): this;
  whereNotIn(columnA: TColumnArg, values: any[]): this;
  whereNotIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.AND);
  }
  orWhereNotIn(columnA: TColumnArg, sub: SubQuery): this;
  orWhereNotIn(columnA: TColumnArg, values: any[]): this;
  orWhereNotIn(...args: any[]) {
    return this.addWhereIn(args as any, OperatorEnum.OR);
  }
  whereNull(column: TColumnArg) {
    return this.addWhereNull(column, OperatorEnum.AND);
  }
  orWhereNull(...args: any[]) {
    return this.addWhereNull(args as any, OperatorEnum.OR);
  }
  whereNotNull(...args: any[]) {
    return this.addWhereNull(args as any, OperatorEnum.OR, OperatorEnum.NOT);
  }
  orWhereNotNull(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.AND, OperatorEnum.NOT);
  }
  whereBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.AND);
  }
  orWhereBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.OR);
  }
  whereNotBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.AND, OperatorEnum.NOT);
  }
  orWhereNotBetween(...args: any[]) {
    return this.addWhereBetween(args, OperatorEnum.OR, OperatorEnum.NOT);
  }
  /**
   * Date Helpers:
   */
  whereDate(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  orWhereDate(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  whereTime(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  orWhereTime(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  whereDay(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  orWhereDay(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  whereMonth(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  orWhereMonth(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  whereYear(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  orWhereYear(...args: any[]) {
    return this.chain(ast => {
      return ast;
    });
  }
  protected addWhere(
    args: any[],
    andOr: TAndOr,
    not: OperatorEnum.NOT | null = null
  ) {
    return this;
  }
  protected addWhereColumn(
    args: any[],
    andOr: TAndOr,
    not: OperatorEnum.NOT | null = null
  ) {
    return this;
  }
  protected addWhereIn(
    args: [TColumnArg, SubQuery] | [TColumnArg, any],
    andOr: TAndOr,
    not: OperatorEnum.NOT | null = null
  ) {
    return this;
  }
  protected addWhereNull(
    args: TColumnArg,
    andOr: TAndOr,
    not: OperatorEnum.NOT | null = null
  ) {
    return this;
  }
  protected addWhereBetween(
    args: any[],
    andOr: TAndOr,
    not: OperatorEnum.NOT | null = null
  ) {
    return this;
  }
  protected abstract chain(fn: ChainFn<any>): this;
}

export class SubWhereBuilder extends WhereClauseBuilder {
  constructor(protected ast = whereClauseNode) {
    super();
  }
  protected chain(fn: ChainFnWhere) {
    return this;
  }
}
