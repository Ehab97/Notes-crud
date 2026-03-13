import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getNoteById, updateNote, deleteNote } from '@/lib/notes';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const note = getNoteById(id, session.user.id);
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(note);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const note = getNoteById(id, session.user.id);
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const { title, contentJson } = body;
  if (!title || typeof title !== 'string' || !contentJson || typeof contentJson !== 'string') {
    return NextResponse.json({ error: 'title and contentJson are required' }, { status: 400 });
  }

  updateNote(id, session.user.id, title, contentJson);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const note = getNoteById(id, session.user.id);
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  deleteNote(id, session.user.id);
  return NextResponse.json({ success: true });
}
