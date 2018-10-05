import { Types } from "./data";
import { Grammar } from "./Grammar";

let cid = 0;

export class KnexConnection {
  cid = cid + 1;

  get grammar() {
    return new Grammar();
  }

  get database(): string {
    throw new Error("Not Implemented");
  }

  constructor(protected connection: any) {}

  async execute<T>(sql: string, bindings: any[], timeout?: number): Promise<T> {
    throw new Error("Not Implemented");
  }

  toString() {
    return `[KnexConnection ${this.cid}]`;
  }

  async columnInfo(tableName: string): Promise<Types.ColumnInfoData[]> {
    throw new Error("Not Implemented");
  }
}
