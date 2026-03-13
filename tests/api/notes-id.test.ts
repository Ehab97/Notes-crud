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
  getNoteById: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { getNoteById, updateNote, deleteNote } from '@/lib/notes'
import { GET, PUT, DELETE } from '@/app/api/notes/[id]/route'

const mockGetSession = vi.mocked(auth.api.getSession)
const mockGetNoteById = vi.mocked(getNoteById)
const mockUpdateNote = vi.mocked(updateNote)
const mockDeleteNote = vi.mocked(deleteNote)

const SESSION = { user: { id: 'user-1' } }
const NOTE = {
  id: 'note-123',
  user_id: 'user-1',
  title: 'Test',
  content_json: '{}',
  is_public: 0,
  public_slug: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
}
const PARAMS = Promise.resolve({ id: 'note-123' })

beforeEach(() => {
  vi.clearAllMocks()
})

function makeReq(method = 'GET', body?: unknown) {
  return new NextRequest('http://localhost/api/notes/note-123', {
    method,
    ...(body ? { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } } : {}),
  })
}

describe('GET /api/notes/[id]', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await GET(makeReq(), { params: PARAMS })
    expect(res.status).toBe(401)
  })

  it('returns 404 when note not found', async () => {
    mockGetSession.mockResolvedValue(SESSION as unknown as Parameters<typeof mockGetSession>[0] extends infer P ? P : never)
    mockGetNoteById.mockReturnValue(undefined)
    const res = await GET(makeReq(), { params: PARAMS })
    expect(res.status).toBe(404)
  })

  it('returns 200 with note', async () => {
    mockGetSession.mockResolvedValue(SESSION as unknown as Parameters<typeof mockGetSession>[0] extends infer P ? P : never)
    mockGetNoteById.mockReturnValue(NOTE)
    const res = await GET(makeReq(), { params: PARAMS })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(NOTE)
  })
})

describe('PUT /api/notes/[id]', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await PUT(makeReq('PUT', { title: 'T', contentJson: '{}' }), { params: PARAMS })
    expect(res.status).toBe(401)
  })

  it('returns 404 when note not found', async () => {
    mockGetSession.mockResolvedValue(SESSION as unknown as Parameters<typeof mockGetSession>[0] extends infer P ? P : never)
    mockGetNoteById.mockReturnValue(undefined)
    const res = await PUT(makeReq('PUT', { title: 'T', contentJson: '{}' }), { params: PARAMS })
    expect(res.status).toBe(404)
  })

  it('returns 400 when title is missing', async () => {
    mockGetSession.mockResolvedValue(SESSION as unknown as Parameters<typeof mockGetSession>[0] extends infer P ? P : never)
    mockGetNoteById.mockReturnValue(NOTE)
    const res = await PUT(makeReq('PUT', { contentJson: '{}' }), { params: PARAMS })
    expect(res.status).toBe(400)
  })

  it('returns 400 when contentJson is missing', async () => {
    mockGetSession.mockResolvedValue(SESSION as unknown as Parameters<typeof mockGetSession>[0] extends infer P ? P : never)
    mockGetNoteById.mockReturnValue(NOTE)
    const res = await PUT(makeReq('PUT', { title: 'T' }), { params: PARAMS })
    expect(res.status).toBe(400)
  })

  it('returns 200 with success:true and calls updateNote', async () => {
    mockGetSession.mockResolvedValue(SESSION as unknown as Parameters<typeof mockGetSession>[0] extends infer P ? P : never)
    mockGetNoteById.mockReturnValue(NOTE)
    const res = await PUT(makeReq('PUT', { title: 'New', contentJson: '{"x":1}' }), { params: PARAMS })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockUpdateNote).toHaveBeenCalledWith('note-123', 'user-1', 'New', '{"x":1}')
  })
})

describe('DELETE /api/notes/[id]', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await DELETE(makeReq('DELETE'), { params: PARAMS })
    expect(res.status).toBe(401)
  })

  it('returns 404 when note not found', async () => {
    mockGetSession.mockResolvedValue(SESSION as unknown as Parameters<typeof mockGetSession>[0] extends infer P ? P : never)
    mockGetNoteById.mockReturnValue(undefined)
    const res = await DELETE(makeReq('DELETE'), { params: PARAMS })
    expect(res.status).toBe(404)
  })

  it('returns 200 with success:true and calls deleteNote', async () => {
    mockGetSession.mockResolvedValue(SESSION as unknown as Parameters<typeof mockGetSession>[0] extends infer P ? P : never)
    mockGetNoteById.mockReturnValue(NOTE)
    const res = await DELETE(makeReq('DELETE'), { params: PARAMS })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockDeleteNote).toHaveBeenCalledWith('note-123', 'user-1')
  })
})
