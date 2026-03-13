import Link from 'next/link';
import type { Note } from '@/lib/notes';

export default function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <p className='text-muted-foreground text-sm'>No notes yet. Create your first one!</p>;
  }

  return (
    <ul className='space-y-2'>
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            href={`/notes/${note.id}`}
            className='flex items-center justify-between rounded-md border border-border px-4 py-3 hover:bg-muted transition-colors'
          >
            <span className='font-medium'>{note.title}</span>
            <div className='flex items-center gap-2'>
              <span className={`text-xs px-2 py-0.5 rounded-full ${note.is_public ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                {note.is_public ? 'Public' : 'Private'}
              </span>
              <span className='text-xs text-muted-foreground'>
                {new Date(note.updated_at).toLocaleDateString()}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
