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
  getNoteById: vi.fn(),
  enableSharing: vi.fn(),
  disableSharing: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { getNoteById, enableSharing, disableSharing } from '@/lib/notes'
import { POST, DELETE } from '@/app/api/notes/[id]/share/route'

const mockGetSession = vi.mocked(auth.api.getSession)
const mockGetNoteById = vi.mocked(getNoteById)
const mockEnableSharing = vi.mocked(enableSharing)
const mockDisableSharing = vi.mocked(disableSharing)

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

function makeReq(method: string) {
  return new NextRequest('http://localhost/api/notes/note-123/share', { method })
}

describe('POST /api/notes/[id]/share', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await POST(makeReq('POST'), { params: PARAMS })
    expect(res.status).toBe(401)
  })

  it('returns 404 when note not found', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    mockGetNoteById.mockReturnValue(undefined)
    const res = await POST(makeReq('POST'), { params: PARAMS })
    expect(res.status).toBe(404)
  })

  it('returns 200 with slug and calls enableSharing', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    mockGetNoteById.mockReturnValue(NOTE)
    mockEnableSharing.mockReturnValue('my-share-slug')
    const res = await POST(makeReq('POST'), { params: PARAMS })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ slug: 'my-share-slug' })
    expect(mockEnableSharing).toHaveBeenCalledWith('note-123', 'user-1')
  })
})

describe('DELETE /api/notes/[id]/share', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await DELETE(makeReq('DELETE'), { params: PARAMS })
    expect(res.status).toBe(401)
  })

  it('returns 404 when note not found', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    mockGetNoteById.mockReturnValue(undefined)
    const res = await DELETE(makeReq('DELETE'), { params: PARAMS })
    expect(res.status).toBe(404)
  })

  it('returns 200 with success:true and calls disableSharing', async () => {
    mockGetSession.mockResolvedValue(SESSION as any)
    mockGetNoteById.mockReturnValue(NOTE)
    const res = await DELETE(makeReq('DELETE'), { params: PARAMS })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(mockDisableSharing).toHaveBeenCalledWith('note-123', 'user-1')
  })
})
