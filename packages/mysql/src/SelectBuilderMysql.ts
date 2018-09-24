import { SelectBuilder, Structs } from "@knex/core";
import { GrammarMysql } from "./GrammarMysql";

export class SelectBuilderMysql extends SelectBuilder {
  grammar = new GrammarMysql();

  protected selectBuilder = (ast = Structs.selectAst) => {
    return new SelectBuilderMysql(ast, true);
  };
}
