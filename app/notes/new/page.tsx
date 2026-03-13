import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import NoteEditor from '@/components/NoteEditor';

export default async function NewNotePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/auth');

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <h1 className='mb-6 text-2xl font-bold'>New Note</h1>
      <NoteEditor />
    </main>
  );
}
