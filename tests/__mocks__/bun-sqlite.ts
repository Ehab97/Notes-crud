export class Database {
  constructor(_path: string, _opts?: unknown) {}
  run(_sql: string, ..._params: unknown[]) {}
  prepare(_sql: string) {
    return {
      all: (..._params: unknown[]) => [],
      get: (..._params: unknown[]) => undefined,
      run: (..._params: unknown[]) => {},
    }
  }
}
