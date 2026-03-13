import { describe, it, expect } from 'vitest'

// bun:sqlite is already aliased to tests/__mocks__/bun-sqlite.ts in vitest config
import { getDb, query, get, run } from '@/lib/db'

describe('getDb()', () => {
  it('returns a database instance', () => {
    const db = getDb()
    expect(db).toBeDefined()
    expect(db).not.toBeNull()
  })

  it('returns the same instance on subsequent calls (singleton)', () => {
    const db1 = getDb()
    const db2 = getDb()
    expect(db1).toBe(db2)
  })
})

describe('query<T>()', () => {
  it('returns an array', () => {
    const result = query('SELECT * FROM notes')
    expect(Array.isArray(result)).toBe(true)
  })

  it('returns empty array from mock', () => {
    const result = query<{ id: string }>('SELECT * FROM notes WHERE user_id = ?', 'user-1')
    expect(result).toEqual([])
  })
})

describe('get<T>()', () => {
  it('returns undefined from mock when not found', () => {
    const result = get<{ id: string }>('SELECT * FROM notes WHERE id = ?', 'note-1')
    expect(result).toBeUndefined()
  })

  it('accepts SQL and params without throwing', () => {
    expect(() => get('SELECT * FROM notes WHERE id = ?', 'x')).not.toThrow()
  })
})

describe('run()', () => {
  it('executes without throwing', () => {
    expect(() => run('INSERT INTO notes (id) VALUES (?)', 'test-id')).not.toThrow()
  })

  it('accepts SQL with multiple params', () => {
    expect(() =>
      run('UPDATE notes SET title = ?, updated_at = ? WHERE id = ? AND user_id = ?',
        'New Title', '2026-01-01', 'note-1', 'user-1')
    ).not.toThrow()
  })
})
