import { DeleteBuilder } from "./DeleteBuilder";

export class KnexInstance {
  select(...columns: string[]) {
    return;
  }
  where() {}
  delete() {
    return new DeleteBuilder();
  }
  del() {
    return this.delete();
  }
}
