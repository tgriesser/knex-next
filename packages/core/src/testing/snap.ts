import { SelectBuilder } from "../SelectBuilder";
import { DeleteBuilder } from "../DeleteBuilder";
import { UpdateBuilder } from "../UpdateBuilder";
import { InsertBuilder } from "../InsertBuilder";
import { SchemaBuilder } from "../SchemaBuilder";

type Builder = SelectBuilder | DeleteBuilder | UpdateBuilder | InsertBuilder;

export function snapSQL(b: Builder) {
  expect(b.toOperation().sql).toMatchSnapshot();
}

export function snap(b: Builder) {
  expect(b.getAst()).toMatchSnapshot();
  const op = b.toOperation();
  expect(op).toMatchSnapshot();
  // Return this so we can chain .toMatchInlineSnapshot for a quick visual
  // debug/sanity check without switching files. This should be removed
  return expect(op.sql);
}

export function snapSchema(b: SchemaBuilder) {
  expect(b.getAst()).toMatchSnapshot();
  const op = b.toOperations();
}

export function snapSchemaSQL(b: SchemaBuilder) {
  expect(b.toOperations());
}
