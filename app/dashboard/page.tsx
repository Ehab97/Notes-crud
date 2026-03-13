import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getNotesByUserId } from '@/lib/notes';
import NoteList from '@/components/NoteList';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  const notes = getNotesByUserId(session.user.id);

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>My Notes</h1>
        <Link
          href='/notes/new'
          className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90'
        >
          New Note
        </Link>
      </div>
      <NoteList notes={notes} />
    </main>
  );
}
