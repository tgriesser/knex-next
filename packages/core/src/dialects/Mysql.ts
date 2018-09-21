import { SelectBuilder } from "../SelectBuilder";
import { Grammar } from "../Grammar";

export class MysqlGrammar extends Grammar {}

export class MysqlSelectBuilder extends SelectBuilder {
  grammar = new MysqlGrammar();
}
