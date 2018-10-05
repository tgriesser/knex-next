import { SelectBuilder } from "./SelectBuilder";
import { InsertBuilder } from "./InsertBuilder";
import { UpdateBuilder } from "./UpdateBuilder";
import { DeleteBuilder } from "./DeleteBuilder";

export class CoreSelectBuilder extends SelectBuilder {
  protected insertBuilder() {
    return new CoreInsertBuilder();
  }
  protected updateBuilder() {
    return new CoreUpdateBuilder();
  }
  protected deleteBuilder() {
    return new CoreDeleteBuilder();
  }
}

export class CoreInsertBuilder extends InsertBuilder {
  protected selectBuilder() {
    return new CoreSelectBuilder();
  }
}

export class CoreUpdateBuilder extends UpdateBuilder {
  protected selectBuilder() {
    return new CoreSelectBuilder();
  }
}

export class CoreDeleteBuilder extends DeleteBuilder {
  protected selectBuilder() {
    return new CoreSelectBuilder();
  }
}
