import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getNoteById } from '@/lib/notes';
import NoteViewer from '@/components/NoteViewer';
import DeleteNoteButton from '@/components/DeleteNoteButton';
import ShareToggle from '@/components/ShareToggle';

export default async function NoteViewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  const { id } = await params;
  const note = getNoteById(id, session.user.id);
  if (!note) notFound();

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <div className='mb-6 flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold'>{note.title}</h1>
        <div className='flex gap-2'>
          <Link
            href={`/notes/${note.id}/edit`}
            className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90'
          >
            Edit
          </Link>
          <DeleteNoteButton noteId={note.id} />
        </div>
        <ShareToggle
          noteId={note.id}
          initialIsPublic={note.is_public === 1}
          initialSlug={note.public_slug}
        />
      </div>
      <NoteViewer contentJson={note.content_json} />
    </main>
  );
}
