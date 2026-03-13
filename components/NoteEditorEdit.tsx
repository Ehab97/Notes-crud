'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Note } from '@/lib/notes';
import EditorToolbar from './EditorToolbar';

export default function NoteEditorEdit({ note }: { note: Note }) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } })],
    content: (() => {
      let parsed = JSON.parse(note.content_json);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return parsed;
    })(),
  });

  async function handleSave() {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!editor) return;

    setLoading(true);
    setError('');

    const res = await fetch(`/api/notes/${note.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        contentJson: JSON.stringify(editor.getJSON()),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Failed to save note.');
      setLoading(false);
      return;
    }

    router.push(`/notes/${note.id}`);
  }

  return (
    <div className='space-y-4'>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='w-full rounded-md border border-border bg-background px-3 py-2 text-lg font-semibold outline-none focus:ring-2 focus:ring-ring'
      />

      <div>
        <EditorToolbar editor={editor} />
        <div className='min-h-50 rounded-b-md border border-border bg-background px-3 py-2 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-45'>
          <EditorContent editor={editor} />
        </div>
      </div>

      {error && <p className='text-sm text-destructive'>{error}</p>}

      <button
        onClick={handleSave}
        disabled={loading}
        className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50'
      >
        {loading ? 'Saving…' : 'Save Note'}
      </button>
    </div>
  );
}
