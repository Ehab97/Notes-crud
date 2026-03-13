import { notFound } from 'next/navigation';
import { getNoteBySlug } from '@/lib/notes';
import NoteViewer from '@/components/NoteViewer';

export default async function PublicNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <h1 className='mb-6 text-2xl font-bold'>{note.title}</h1>
      <NoteViewer contentJson={note.content_json} />
    </main>
  );
}
