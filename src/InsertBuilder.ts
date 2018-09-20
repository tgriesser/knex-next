import { ChainFnInsert } from "./types";

export class InsertBuilder {
  public readonly dialect = null;

  into(tableName: string) {}

  select() {}

  values() {}

  inBatchesOf(value: number) {}

  insert() {
    return this.chain(ast => {
      return ast;
    });
  }

  insertGetId() {
    return this.chain(ast => {
      return ast;
    });
  }

  protected chain(fn: ChainFnInsert) {
    return;
  }
}

export class UpsertBuilder extends InsertBuilder {
  // update() {
  //   return this.chain(ast => {
  //     return ast;
  //   });
  // }
  // updateOrInsert() {
  //   return this.chain(ast => {
  //     return ast;
  //   });
  // }
}
