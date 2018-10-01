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
  LEFT_OUTER = "LEFT OUTER",
  RIGHT_OUTER = "RIGHT OUTER",
  FULL_OUTER = "FULL OUTER",
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
  ALIASED = "AliasedIdentNode",
  AGGREGATE = "AggregateNode",
  BINDING = "BindingNode",
  JOIN = "JoinNode",
  ORDER_BY = "OrderByNode",
  UNION = "UnionNode",
  SUB_QUERY = "SubQueryNode",
  RAW = "RawNode",
  COND_EXPR = "CondExpressionNode",
  COND_COLUMN = "CondColumnNode",
  COND_IN = "CondInNode",
  COND_EXISTS = "CondExistsNode",
  COND_NULL = "CondNullNode",
  COND_BETWEEN = "CondBetweenNode",
  COND_LIKE = "CondLikeNode",
  COND_SUB = "CondSubNode",
  COND_RAW = "CondRawNode",
  COND_DATE = "CondDateNode",
}

export enum AggregateFns {
  COUNT = "COUNT",
  MIN = "MIN",
  MAX = "MAX",
  SUM = "SUM",
  AVG = "AVG",
}

export enum DateCondType {
  DATE = "DATE",
  TIME = "TIME",
  DAY = "DAY",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export enum OrderByEnum {
  ASC = "ASC",
  DESC = "DESC",
}
