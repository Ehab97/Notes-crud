import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { enableSharing, disableSharing, getNoteById } from '@/lib/notes';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const note = getNoteById(id, session.user.id);
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const slug = enableSharing(id, session.user.id);
  return NextResponse.json({ slug });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const note = getNoteById(id, session.user.id);
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  disableSharing(id, session.user.id);
  return NextResponse.json({ success: true });
}
