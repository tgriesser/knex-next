export class ExecutionContext {
  constructor() {}

  asPromise<T>(): Promise<T> {
    return new Promise(() => {});
  }
}
