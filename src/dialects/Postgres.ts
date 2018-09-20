import { BaseSelectBuilder } from "../SelectBuilder";
import { ChainFn } from "../types";
import { TSelectOperation } from "../datatypes";

export class PostgresQueryBuilder extends BaseSelectBuilder {
  protected operators = [
    "=",
    "<",
    ">",
    "<=",
    ">=",
    "<>",
    "!=",
    "like",
    "not like",
    "between",
    "ilike",
    "not ilike",
    "~",
    "&",
    "|",
    "#",
    "<<",
    ">>",
    "<<=",
    ">>=",
    "&&",
    "@>",
    "<@",
    "?",
    "?|",
    "?&",
    "||",
    "-",
    "-",
    "#-",
    "is distinct from",
    "is not distinct from",
  ];

  toMutable(): PostgresQueryBuilder {
    return this;
  }

  toImmutable(): ImmutablePostgresQueryBuilder {
    return new ImmutablePostgresQueryBuilder(this.ast);
  }

  protected chain(fn: ChainFn<TSelectOperation>): PostgresQueryBuilder {
    return this;
  }
}

export class ImmutablePostgresQueryBuilder extends PostgresQueryBuilder {
  toMutable(): PostgresQueryBuilder {
    return new PostgresQueryBuilder(this.ast);
  }
  toImmutable(): ImmutablePostgresQueryBuilder {
    return this;
  }
  protected chain(fn: ChainFn<TSelectOperation>) {
    return new ImmutablePostgresQueryBuilder(fn(this.ast));
  }
}
