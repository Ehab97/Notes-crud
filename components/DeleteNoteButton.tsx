'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';

export default function DeleteNoteButton({ noteId }: { noteId: string }) {
  const router = useRouter();
  const toast = useToast();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setLoading(true);
    setError('');
    const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data.error ?? 'Failed to delete note.';
      setError(msg);
      toast(msg, 'error');
      setLoading(false);
      return;
    }
    toast('Note deleted.', 'success');
    router.push('/dashboard');
  }

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className='rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground'
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 rounded-lg border border-border bg-background text-foreground p-6 shadow-lg backdrop:bg-black/60 max-w-sm w-full'
      >
        <h2 className='mb-2 text-lg font-semibold'>Delete note?</h2>
        <p className='mb-6 text-sm text-muted-foreground'>This action cannot be undone.</p>
        {error && <p className='mb-4 text-sm text-destructive'>{error}</p>}
        <div className='flex justify-end gap-3'>
          <button
            onClick={() => dialogRef.current?.close()}
            disabled={loading}
            className='rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className='rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50'
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </dialog>
    </>
  );
}
