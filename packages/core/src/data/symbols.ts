/**
 * These symbols are used in predicates determining the type of an
 * object rather than using `instanceof`.
 */
export const SELECT_BUILDER = Symbol.for("@knex/select-builder");

export const UPDATE_BUILDER = Symbol.for("@knex/update-builder");

export const DELETE_BUILDER = Symbol.for("@knex/delete-builder");

export const INSERT_BUILDER = Symbol.for("@knex/insert-builder");
