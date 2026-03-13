'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function NoteViewer({ contentJson }: { contentJson: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } })],
    content: (() => {
      let parsed = JSON.parse(contentJson);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return parsed;
    })(),
  });

  return (
    <div className='rounded-md border border-border bg-background px-3 py-2 [&_.ProseMirror]:outline-none prose prose-sm max-w-none'>
      <EditorContent editor={editor} />
    </div>
  );
}
