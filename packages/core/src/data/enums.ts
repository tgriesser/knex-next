export enum DialectEnum {
  MYSQL = "mysql",
  SQLITE = "sqlite",
  POSTGRESQL = "postgresql",
  ORACLE = "oracle",
  MSSQL = "mssql",
}

export enum JoinTypeEnum {
  INNER = "INNER",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  LEFT_OUTER = "LEFT_OUTER",
  RIGHT_OUTER = "RIGHT_OUTER",
  FULL_OUTER = "FULL_OUTER",
  OUTER = "OUTER",
  CROSS = "CROSS",
}

export enum OperationTypeEnum {
  SELECT = "SELECT",
  INSERT = "INSERT",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  TRUNCATE = "TRUNCATE",
  CREATE_TABLE = "CREATE_TABLE",
  ALTER_TABLE = "ALTER_TABLE",
}

export enum OperatorEnum {
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
}

export enum ClauseTypeEnum {
  JOIN = "JoinClause",
  WHERE = "WhereClause",
  HAVING = "HavingClause",
}

export enum NodeTypeEnum {
  BINDING = "BindingNode",
  JOIN = "JoinNode",
  ORDER_BY = "OrderByNode",
  GROUP_BY = "GroupByNode",
  UNION = "UnionNode",
  SUB_QUERY = "SubQueryNode",
  RAW = "RawNode",
  WHERE_EXPR = "WhereExpressionNode",
  WHERE_COLUMN = "WhereColumnNode",
  WHERE_IN = "WhereInNode",
  WHERE_EXISTS = "WhereExistsNode",
  WHERE_NULL = "WhereNullNode",
  WHERE_BETWEEN = "WhereBetweenNode",
  WHERE_LIKE = "WhereLikeNode",
  WHERE_SUB = "WhereSubNode",
  HAVING_EXPR = "HavingExpressionNode",
}
