import { WhereClauseBuilder } from "./clauses/WhereClauseBuilder";
import { SelectBuilder } from "./SelectBuilder";
import { IBuilder } from "./contracts/Buildable";
import { Grammar } from "./Grammar";
import { Mixins, Enums, Types, Structs } from "./data";

export interface DeleteBuilder extends Types.ExecutableBuilder {}

export class DeleteBuilder extends WhereClauseBuilder implements IBuilder {
  dialect = null;

  protected grammar = new Grammar();

  constructor(protected ast = Structs.deleteAst) {
    super();
  }

  from(tableName: string) {
    return this.chain(ast => ast.set("table", tableName));
  }

  getAst() {
    return this.ast;
  }

  protected pushCondition(clauseType: Enums.ClauseTypeEnum, node: Types.TConditionNode) {
    return this.chain(ast => {
      if (clauseType === Enums.ClauseTypeEnum.WHERE) {
        return ast.set("where", ast.where.push(node));
      }
      return ast;
    });
  }

  protected subCondition(
    clauseType: Enums.ClauseTypeEnum,
    fn: Types.SubConditionFn,
    andOr: Types.TAndOr,
    not: Types.TNot = null
  ) {
    return this;
  }

  protected selectBuilder() {
    return new SelectBuilder();
  }

  protected subQuery(fn: Types.SubQueryArg) {
    const builder = this.selectBuilder();
    fn.call(builder, builder);
    return Structs.SubQueryNode({ ast: builder.getAst() });
  }

  protected chain(fn: Types.ChainFnDelete) {
    this.ast = fn(this.ast);
    return this;
  }
}

Mixins.withExecutionMethods(DeleteBuilder);
