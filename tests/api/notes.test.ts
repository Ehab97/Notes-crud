/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

vi.mock('@/lib/notes', () => ({
  getNotesByUserId: vi.fn(),
  createNote: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { getNotesByUserId, createNote } from '@/lib/notes'
import { GET, POST } from '@/app/api/notes/route'

const mockGetSession = vi.mocked(auth.api.getSession)
const mockGetNotesByUserId = vi.mocked(getNotesByUserId)
const mockCreateNote = vi.mocked(createNote)

const SESSION = { user: { id: 'user-1' } }
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

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/notes', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 200 with notes array', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    mockGetNotesByUserId.mockReturnValue([NOTE])
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([NOTE])
  })

  it('calls getNotesByUserId with userId', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    mockGetNotesByUserId.mockReturnValue([])
    await GET()
    expect(mockGetNotesByUserId).toHaveBeenCalledWith('user-1')
  })
})

describe('POST /api/notes', () => {
  function makeReq(body: unknown) {
    return new NextRequest('http://localhost/api/notes', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
  }

  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await POST(makeReq({ title: 'T', contentJson: '{}' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when title is missing', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    const res = await POST(makeReq({ contentJson: '{}' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when contentJson is missing', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    const res = await POST(makeReq({ title: 'T' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when values are non-string', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    const res = await POST(makeReq({ title: 123, contentJson: true }))
    expect(res.status).toBe(400)
  })

  it('returns 201 with created note', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    mockCreateNote.mockReturnValue(NOTE)
    const res = await POST(makeReq({ title: 'Test', contentJson: '{}' }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toEqual(NOTE)
  })

  it('calls createNote with userId, title, contentJson', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    mockCreateNote.mockReturnValue(NOTE)
    await POST(makeReq({ title: 'Test', contentJson: '{}' }))
    expect(mockCreateNote).toHaveBeenCalledWith('user-1', 'Test', '{}')
  })
})
