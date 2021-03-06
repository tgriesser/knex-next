# knex-next

Nothing to see here yet. This is a future verison of knex (TypeScript + internal rewrite), just putting it here for anyone that's really interested in the direction it's heading and/or really wants to help. This will likely all get squashed down & merged into knex as a 2.0 PR so any contributions might be lost. Most of the interesting stuff is in [core](https://github.com/tgriesser/knex-next/tree/master/packages/core/src)

Goals:

- Strong typing
- Complete test coverage
  - lots of builder snapshots w/ jest
  - integration & unit tests where they make sense
- Simplify the internals
  - Get rid of the whole formatter mess
- Partial query construction without a connected knex instance
- Better dialect feature separation
- Prepared queries
- Dedicated plugins
- Make it easy to extend / do advanced pooling / etc.
- Capitalized keywords w/ plugin to

New Features:

- Date aware "where" methods
- JSON where clauses & updates
