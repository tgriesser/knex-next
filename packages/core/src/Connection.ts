let cid = 0;

export abstract class KnexConnection {
  cid = cid + 1;

  constructor(protected connection: any) {}

  abstract async beginTransaction(): Promise<void>;

  toString() {
    return `[KnexConnection ${this.cid}]`;
  }
}
