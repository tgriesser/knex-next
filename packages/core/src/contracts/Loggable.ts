export interface Loggable {
  /**
   * Logs a message
   */
  log(msg: string): void;
  /**
   * Logs an error
   */
  error(err: Error): void;
  /**
   * Logs a warning
   */
  warn(msg: string | Error): void;
}
