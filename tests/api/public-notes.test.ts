import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/notes', () => ({
  getNoteBySlug: vi.fn(),
}))

import { getNoteBySlug } from '@/lib/notes'
import { GET } from '@/app/api/public-notes/[slug]/route'

const mockGetNoteBySlug = vi.mocked(getNoteBySlug)

const NOTE = {
  id: 'note-123',
  user_id: 'user-1',
  title: 'Public Note',
  content_json: '{}',
  is_public: 1,
  public_slug: 'my-share-slug',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
}
const PARAMS = Promise.resolve({ slug: 'my-share-slug' })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/public-notes/[slug]', () => {
  it('returns 404 when note not found', async () => {
    mockGetNoteBySlug.mockReturnValue(undefined)
    const req = new NextRequest('http://localhost/api/public-notes/my-share-slug')
    const res = await GET(req, { params: PARAMS })
    expect(res.status).toBe(404)
  })

  it('returns 200 with note and calls getNoteBySlug', async () => {
    mockGetNoteBySlug.mockReturnValue(NOTE)
    const req = new NextRequest('http://localhost/api/public-notes/my-share-slug')
    const res = await GET(req, { params: PARAMS })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(NOTE)
    expect(mockGetNoteBySlug).toHaveBeenCalledWith('my-share-slug')
  })
})
