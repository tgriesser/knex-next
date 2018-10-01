import { WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { ChainFnDelete, SubQueryArg, SubConditionFn, TAndOr, TConditionNode, TNot } from "./data/types";
import { deleteAst, SubQueryNode } from "./data/structs";
import { SelectBuilder } from "./SelectBuilder";
import { ClauseTypeEnum } from "./data/enums";
import { Buildable } from "./contracts/Buildable";
import { Grammar } from "./Grammar";

export class DeleteBuilder extends WhereClauseBuilder implements Buildable {
  dialect = null;

  protected grammar = new Grammar();

  constructor(protected ast = deleteAst) {
    super();
  }

  from(tableName: string) {
    return this.chain(ast => ast.set("table", tableName));
  }

  getAst() {
    return this.ast;
  }

  toOperation() {
    return this.grammar.toOperation(this.ast);
  }

  protected pushCondition(clauseType: ClauseTypeEnum, node: TConditionNode) {
    return this.chain(ast => {
      if (clauseType === ClauseTypeEnum.WHERE) {
        return ast.set("where", ast.where.push(node));
      }
      return ast;
    });
  }

  protected subCondition(clauseType: ClauseTypeEnum, fn: SubConditionFn, andOr: TAndOr, not: TNot = null) {
    return this;
  }

  protected selectBuilder() {
    return new SelectBuilder();
  }

  protected subQuery(fn: SubQueryArg) {
    const builder = this.selectBuilder();
    fn.call(builder, builder);
    return new SubQueryNode({ ast: builder.getAst() });
  }

  protected chain(fn: ChainFnDelete) {
    this.ast = fn(this.ast);
    return this;
  }
}
