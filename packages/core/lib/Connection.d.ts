import { Maybe } from "./data/types";
export interface ColumnInfoData {
    type: string;
    maxLength: Maybe<number>;
    nullable: boolean;
    defaultValue: any;
}
export declare abstract class Connection {
    protected connection: any;
    cid: number;
    abstract readonly database: string;
    constructor(connection: any);
    abstract beginTransaction(): Promise<void>;
    toString(): string;
    abstract columnInfo(tableName: string): Promise<ColumnInfoData[]>;
}
