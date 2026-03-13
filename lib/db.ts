import { Database, type SQLQueryBindings } from 'bun:sqlite';
import { mkdirSync } from 'fs';

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    mkdirSync('data', { recursive: true });
    db = new Database('data/app.db', { create: true, strict: true });
    db.run('PRAGMA journal_mode = WAL');
  }
  return db;
}

export function query<T>(sql: string, ...params: SQLQueryBindings[]): T[] {
  return getDb()
    .prepare(sql)
    .all(...params) as T[];
}

export function get<T>(sql: string, ...params: SQLQueryBindings[]): T | undefined {
  return getDb()
    .prepare(sql)
    .get(...params) as T | undefined;
}

export function run(sql: string, ...params: SQLQueryBindings[]) {
  return getDb()
    .prepare(sql)
    .run(...params);
}
