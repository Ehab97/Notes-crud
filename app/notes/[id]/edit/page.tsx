import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getNoteById } from '@/lib/notes';
import NoteEditorEdit from '@/components/NoteEditorEdit';
import ShareToggle from '@/components/ShareToggle';

export default async function NoteEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  const { id } = await params;
  const note = getNoteById(id, session.user.id);
  if (!note) notFound();

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <div className='mb-6 flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold'>Edit Note</h1>
        <ShareToggle
          noteId={note.id}
          initialIsPublic={note.is_public === 1}
          initialSlug={note.public_slug}
        />
      </div>
      <NoteEditorEdit note={note} />
    </main>
  );
}
