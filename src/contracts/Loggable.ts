export interface Loggable {
  log(msg: string): void;
  error(err: Error): void;
  warn(msg: string | Error): void;
}
