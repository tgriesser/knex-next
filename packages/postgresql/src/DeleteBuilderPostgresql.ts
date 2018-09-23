import { DeleteBuilder } from "@knex/core";

/**
 * @see https://www.postgresql.org/docs/10/static/sql-delete.html
 */
export class DeleteBuilderPostgresql extends DeleteBuilder {
  /**
   * The name (optionally schema-qualified) of the table to delete rows from.
   * If ONLY is specified before the table name, matching rows are deleted from
   * the named table only. If ONLY is not specified, matching rows are also
   * deleted from any tables inheriting from the named table. Optionally, * can
   * be specified after the table name to explicitly indicate that descendant
   * tables are included.
   */
  fromOnly(tableName: string) {
    return this.from(tableName);
  }

  /**
   * The WITH clause allows you to specify one or more subqueries that can be
   * referenced by name in the DELETE query.
   */
  withQuery() {}

  /**
   * @see withQuery
   */
  withRecursive() {}

  /**
   * A list of table expressions, allowing columns from other tables
   * to appear in the WHERE condition. This is similar to the list of
   * tables that can be specified in the FROM Clause of a SELECT statement; for
   * example, an alias for the table name can be specified. Do not repeat
   * the target table in the using_list, unless you wish to set up a self-join.
   */
  using() {}

  /**
   * The optional RETURNING clause causes DELETE to compute and return value(s)
   * based on each row actually deleted. Any expression using the table's columns,
   * and/or columns of other tables mentioned in USING, can be computed. The syntax
   * of the RETURNING list is identical to that of the output list of SELECT.
   */
  returning() {}
}
