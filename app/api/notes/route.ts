import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNotesByUserId, createNote } from '@/lib/notes';
import { headers } from 'next/headers';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const notes = getNotesByUserId(session.user.id);
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, contentJson } = body;

  if (!title || typeof title !== 'string' || !contentJson || typeof contentJson !== 'string') {
    return NextResponse.json({ error: 'title and contentJson are required' }, { status: 400 });
  }

  const note = createNote(session.user.id, title, contentJson);
  return NextResponse.json(note, { status: 201 });
}
