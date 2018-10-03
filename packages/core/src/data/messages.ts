import dedent from "dedent";

export const NEVER = dedent`
  If you are receiving this message, something is wrong an extension of Knex,
  because this error should never happen under normal use.
`;

export const MISSING_CONNECTION = dedent`
  Oops, looks like you're trying to execute a builder without a connection.
  Execution is defined as:
    - calling .then() or .catch(), either directly or indirectly via async / await
    - calling any of the EventEmitter methods (.on, .off, etc.)
    - beginning async iteration
  Be sure to provide a connection with .setConnection or use the helpers which take care of this for you.
`;

export const IMMUTABLE_EXECUTION = dedent`
  Oops, looks like you're trying to execute a builder which is defined as an immutable instance.
  Execution is defined as:
    - calling .then() or .catch(), either directly or indirectly via async / await
    - calling any of the EventEmitter methods (.on, .off, etc.)
    - beginning async iteration
  As an alternative, you may instead call .clone() which clones the builder's AST and then execute
`;

export const SUBQUERY_EXECUTION = dedent`
  Oops, looks like you are attempting to call .then or an EventEmitter method 
  (.on, .off, etc.) on a SubQuery. 
  This is not permitted as only the outer query may be executed or used as an
  EventEmitter.
`;
