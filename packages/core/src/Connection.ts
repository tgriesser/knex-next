import { Types } from "./data";

let cid = 0;

export abstract class Connection {
  cid = cid + 1;

  abstract readonly database: string;

  constructor(protected connection: any) {}

  abstract async beginTransaction(): Promise<void>;

  toString() {
    return `[KnexConnection ${this.cid}]`;
  }

  abstract async columnInfo(tableName: string): Promise<Types.ColumnInfoData[]>;
}
