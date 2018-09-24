# Knex 2.0

## Big new features!

The ability to compose & precompile queries everywhere!

Because Knex now uses Immutable.js records as the backing data structures
for all query operations, it is inexpensive to create partial queries, where clauses,
etc. at the top level, before a connection is even acquired to begin executing a query.

This means you can do something like this;

```ts
import { StatusEnum } from "@mysite/constants";
import { raw, queryBuilder } from "@knex/mysql";

const inactiveScope = queryBuilder()
  .where("accountStatus", StatusEnum.INACTIVE)
  .orWhereNull("approvedAt")
  .toImmutable();

// Elsewhere in the application

knex
  .select("id", "name")
  .mix(inactiveScope)
  .limit(10);
```

## Bug fixes! (or breaking changes, dependning on your use)

The Promise API is now properly followed, in that a promise will not be executed twice

## Major API Changes:

### INSERT, UPDATE, DELETE

The type of operation must now be supplied at the beginning of the query,
in the cases of "UPDATE", "DELETE", and "INSERT", rather than delayed until
after `where` clauses, etc.

The query syntax has also been altered to read closer to the query that would
otherwise be written with SQL:

```
knex.insertInto('tableName').values(...)
```

```
knex.update('tableName').set({ a: 1, b: 2 })
```

```
knex.deleteFrom('tableName').where('id', 1)
```

### The "raw" template tag

Knex now exposes a raw`` tagged template literal exported at the top level, so you can create and compose.

## Other Changes

The `.using` clause of a join should now be provided via the "raw"
template tag as it is not a particularly common syntax.

```ts
.innerJoin(raw`accounts using id`)
```
