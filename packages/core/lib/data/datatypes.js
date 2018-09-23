"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
var DialectEnum;
(function (DialectEnum) {
    DialectEnum["MYSQL"] = "mysql";
    DialectEnum["SQLITE"] = "sqlite";
    DialectEnum["POSTGRESQL"] = "postgresql";
    DialectEnum["ORACLE"] = "oracle";
    DialectEnum["MSSQL"] = "mssql";
})(DialectEnum = exports.DialectEnum || (exports.DialectEnum = {}));
var JoinTypeEnum;
(function (JoinTypeEnum) {
    JoinTypeEnum["INNER"] = "INNER";
    JoinTypeEnum["LEFT"] = "LEFT";
    JoinTypeEnum["RIGHT"] = "RIGHT";
    JoinTypeEnum["LEFT_OUTER"] = "LEFT_OUTER";
    JoinTypeEnum["RIGHT_OUTER"] = "RIGHT_OUTER";
    JoinTypeEnum["FULL_OUTER"] = "FULL_OUTER";
    JoinTypeEnum["OUTER"] = "OUTER";
    JoinTypeEnum["CROSS"] = "CROSS";
})(JoinTypeEnum = exports.JoinTypeEnum || (exports.JoinTypeEnum = {}));
var OperationTypeEnum;
(function (OperationTypeEnum) {
    OperationTypeEnum["SELECT"] = "SELECT";
    OperationTypeEnum["INSERT"] = "INSERT";
    OperationTypeEnum["UPDATE"] = "UPDATE";
    OperationTypeEnum["DELETE"] = "DELETE";
    OperationTypeEnum["TRUNCATE"] = "TRUNCATE";
    OperationTypeEnum["CREATE_TABLE"] = "CREATE_TABLE";
    OperationTypeEnum["ALTER_TABLE"] = "ALTER_TABLE";
})(OperationTypeEnum = exports.OperationTypeEnum || (exports.OperationTypeEnum = {}));
var OperatorEnum;
(function (OperatorEnum) {
    OperatorEnum["AND"] = "AND";
    OperatorEnum["OR"] = "OR";
    OperatorEnum["NOT"] = "NOT";
})(OperatorEnum = exports.OperatorEnum || (exports.OperatorEnum = {}));
var ClauseTypeEnum;
(function (ClauseTypeEnum) {
    ClauseTypeEnum["JOIN"] = "JoinClause";
    ClauseTypeEnum["WHERE"] = "WhereClause";
    ClauseTypeEnum["HAVING"] = "HavingClause";
})(ClauseTypeEnum = exports.ClauseTypeEnum || (exports.ClauseTypeEnum = {}));
var NodeTypeEnum;
(function (NodeTypeEnum) {
    NodeTypeEnum["JOIN"] = "JoinNode";
    NodeTypeEnum["ORDER_BY"] = "OrderByNode";
    NodeTypeEnum["GROUP_BY"] = "GroupByNode";
    NodeTypeEnum["UNION"] = "UnionNode";
    NodeTypeEnum["SUB_QUERY"] = "SubQueryNode";
    NodeTypeEnum["RAW"] = "RawNode";
    NodeTypeEnum["WHERE_EXPR"] = "WhereExpressionNode";
    NodeTypeEnum["WHERE_COLUMN"] = "WhereColumnNode";
    NodeTypeEnum["WHERE_IN"] = "WhereInNode";
    NodeTypeEnum["WHERE_EXISTS"] = "WhereExistsNode";
    NodeTypeEnum["WHERE_NULL"] = "WhereNullNode";
    NodeTypeEnum["WHERE_BETWEEN"] = "WhereBetweenNode";
    NodeTypeEnum["WHERE_LIKE"] = "WhereLikeNode";
    NodeTypeEnum["WHERE_SUB"] = "WhereSubNode";
    NodeTypeEnum["HAVING_EXPR"] = "HavingExpressionNode";
})(NodeTypeEnum = exports.NodeTypeEnum || (exports.NodeTypeEnum = {}));
exports.JoinNode = immutable_1.Record({
    __typename: NodeTypeEnum.JOIN,
}, NodeTypeEnum.JOIN);
exports.WhereClause = immutable_1.Record({
    __clause: ClauseTypeEnum.WHERE,
    where: immutable_1.List(),
}, "WhereClauseNodes");
exports.whereClauseNode = exports.WhereClause();
exports.WhereExprNode = immutable_1.Record({
    __typename: NodeTypeEnum.WHERE_EXPR,
    not: null,
    column: null,
    operator: null,
    value: null,
    andOr: OperatorEnum.AND,
}, NodeTypeEnum.WHERE_EXPR);
exports.WhereColumnNode = immutable_1.Record({
    __typename: NodeTypeEnum.WHERE_COLUMN,
    not: null,
    column: null,
    operator: null,
    rightColumn: null,
    andOr: OperatorEnum.AND,
}, NodeTypeEnum.WHERE_EXPR);
exports.WhereInNode = immutable_1.Record({
    __typename: NodeTypeEnum.WHERE_IN,
    not: null,
    andOr: OperatorEnum.AND,
}, NodeTypeEnum.WHERE_IN);
exports.WhereNullNode = immutable_1.Record({
    __typename: NodeTypeEnum.WHERE_NULL,
    not: null,
    andOr: OperatorEnum.AND,
    column: null,
}, NodeTypeEnum.WHERE_NULL);
exports.WhereExistsNode = immutable_1.Record({
    __typename: NodeTypeEnum.WHERE_EXISTS,
    not: null,
    andOr: OperatorEnum.AND,
}, NodeTypeEnum.WHERE_EXISTS);
exports.WhereBetweenNode = immutable_1.Record({
    __typename: NodeTypeEnum.WHERE_BETWEEN,
    not: null,
    andOr: OperatorEnum.AND,
}, NodeTypeEnum.WHERE_BETWEEN);
exports.HavingNode = immutable_1.Record({
    __typename: NodeTypeEnum.HAVING_EXPR,
}, NodeTypeEnum.HAVING_EXPR);
exports.OrderByNode = immutable_1.Record({
    __typename: NodeTypeEnum.ORDER_BY,
    column: "",
    direction: "ASC",
}, NodeTypeEnum.ORDER_BY);
exports.GroupByNode = immutable_1.Record({
    __typename: NodeTypeEnum.GROUP_BY,
    column: "",
}, NodeTypeEnum.GROUP_BY);
exports.UnionNode = immutable_1.Record({
    __typename: NodeTypeEnum.UNION,
    ast: null,
}, NodeTypeEnum.UNION);
exports.WhereSubNode = immutable_1.Record({
    __typename: NodeTypeEnum.WHERE_SUB,
    not: null,
    andOr: OperatorEnum.AND,
    ast: null,
}, NodeTypeEnum.WHERE_SUB);
exports.SubQueryNode = immutable_1.Record({
    __typename: NodeTypeEnum.SUB_QUERY,
    ast: null,
}, NodeTypeEnum.SUB_QUERY);
exports.RawNode = immutable_1.Record({
    __typename: NodeTypeEnum.RAW,
    fragments: immutable_1.List(),
    bindings: immutable_1.List(),
}, NodeTypeEnum.RAW);
exports.HavingClause = immutable_1.Record({
    __clause: ClauseTypeEnum.HAVING,
    where: immutable_1.List(),
}, "HavingClauseNodes");
exports.havingClauseNode = exports.HavingClause();
exports.SelectOperationNodes = immutable_1.Record({
    __operation: OperationTypeEnum.SELECT,
    from: null,
    where: immutable_1.List(),
    select: immutable_1.List(),
    join: immutable_1.List(),
    having: immutable_1.List(),
    group: immutable_1.List(),
    order: immutable_1.List(),
    union: immutable_1.List(),
    limit: null,
    offset: null,
    alias: null,
    distinct: false,
    lock: null,
    meta: immutable_1.Map(),
}, "SelectNodes");
exports.selectAst = exports.SelectOperationNodes();
exports.InsertOperation = immutable_1.Record({
    __operation: OperationTypeEnum.INSERT,
    table: null,
    chunkSize: null,
    values: immutable_1.List(),
    select: null,
}, "InsertOperation");
exports.insertAst = exports.InsertOperation();
exports.UpdateOperation = immutable_1.Record({
    __operation: OperationTypeEnum.UPDATE,
    table: "",
}, "UpdateOperation");
exports.updateAst = exports.UpdateOperation();
exports.DeleteBindings = immutable_1.Record({
    __operation: OperationTypeEnum.DELETE,
    table: "",
    where: immutable_1.List(),
}, "DeleteOperation");
exports.deleteAst = exports.DeleteBindings();
exports.TruncateBindings = immutable_1.Record({
    __operation: OperationTypeEnum.TRUNCATE,
    table: null,
}, "TruncateOperation");
exports.truncateAst = exports.TruncateBindings();
exports.CreateTableOperation = immutable_1.Record({
    __operation: OperationTypeEnum.CREATE_TABLE,
    table: "",
    columns: immutable_1.List(),
});
exports.CreateTableColumnNode = immutable_1.Record({
    dataType: null,
});
exports.createTableAst = exports.CreateTableOperation();
