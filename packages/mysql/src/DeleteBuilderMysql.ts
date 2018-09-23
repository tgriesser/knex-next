export class DeleteBuilderMysql {
  /**
   * If you specify LOW_PRIORITY, the server delays execution of the DELETE
   * until no other clients are reading from the table. This affects only
   * storage engines that use only table-level locking (such as MyISAM, MEMORY, and MERGE).
   */
  lowPriority() {}
}
