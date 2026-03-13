import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  query: vi.fn(),
  get: vi.fn(),
  run: vi.fn(),
}))

vi.mock('nanoid', () => ({
  nanoid: vi.fn(),
}))

import { query, get, run } from '@/lib/db'
import { nanoid } from 'nanoid'
import {
  getNotesByUserId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  enableSharing,
  disableSharing,
  getNoteBySlug,
} from '@/lib/notes'

const mockQuery = vi.mocked(query)
const mockGet = vi.mocked(get)
const mockRun = vi.mocked(run)
const mockNanoid = vi.mocked(nanoid)

beforeEach(() => {
  vi.clearAllMocks()
})

const NOTE = {
  id: 'note-1',
  user_id: 'user-1',
  title: 'Test',
  content_json: '{}',
  is_public: 0,
  public_slug: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
}

describe('getNotesByUserId', () => {
  it('calls query with userId and returns array', () => {
    mockQuery.mockReturnValue([NOTE])
    const result = getNotesByUserId('user-1')
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('user_id'), 'user-1')
    expect(result).toEqual([NOTE])
  })
})

describe('getNoteById', () => {
  it('calls get with id and userId', () => {
    mockGet.mockReturnValue(NOTE)
    const result = getNoteById('note-1', 'user-1')
    expect(mockGet).toHaveBeenCalledWith(expect.any(String), 'note-1', 'user-1')
    expect(result).toEqual(NOTE)
  })

  it('returns undefined when note not found', () => {
    mockGet.mockReturnValue(undefined)
    expect(getNoteById('x', 'user-1')).toBeUndefined()
  })
})

describe('createNote', () => {
  it('calls run with INSERT and returns Note with correct shape', () => {
    mockNanoid.mockReturnValue('generated-id')
    const result = createNote('user-1', 'My Title', '{"type":"doc"}')
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('INSERT'),
      'generated-id',
      'user-1',
      'My Title',
      '{"type":"doc"}',
      expect.any(String),
      expect.any(String),
    )
    expect(result.id).toBe('generated-id')
    expect(result.user_id).toBe('user-1')
    expect(result.title).toBe('My Title')
    expect(result.content_json).toBe('{"type":"doc"}')
    expect(result.is_public).toBe(0)
    expect(result.public_slug).toBeNull()
  })
})

describe('updateNote', () => {
  it('calls run with UPDATE SQL and sets updated_at', () => {
    updateNote('note-1', 'user-1', 'New Title', '{}')
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE'),
      'New Title',
      '{}',
      expect.any(String),
      'note-1',
      'user-1',
    )
  })
})

describe('deleteNote', () => {
  it('calls run with DELETE scoped to id and userId', () => {
    deleteNote('note-1', 'user-1')
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('DELETE'),
      'note-1',
      'user-1',
    )
  })
})

describe('enableSharing', () => {
  it('calls nanoid(16), calls run with is_public=1, returns slug', () => {
    mockNanoid.mockReturnValue('abcdefghijklmnop')
    const slug = enableSharing('note-1', 'user-1')
    expect(mockNanoid).toHaveBeenCalledWith(16)
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('is_public = 1'),
      'abcdefghijklmnop',
      'note-1',
      'user-1',
    )
    expect(slug).toBe('abcdefghijklmnop')
  })
})

describe('disableSharing', () => {
  it('calls run with is_public=0 and public_slug=NULL', () => {
    disableSharing('note-1', 'user-1')
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('is_public = 0'),
      'note-1',
      'user-1',
    )
  })
})

describe('getNoteBySlug', () => {
  it('calls get with slug and is_public=1', () => {
    mockGet.mockReturnValue(NOTE)
    const result = getNoteBySlug('my-slug')
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('is_public = 1'),
      'my-slug',
    )
    expect(result).toEqual(NOTE)
  })

  it('returns undefined when not found', () => {
    mockGet.mockReturnValue(undefined)
    expect(getNoteBySlug('bad-slug')).toBeUndefined()
  })
})
