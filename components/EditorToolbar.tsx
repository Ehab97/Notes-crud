'use client';

import type { Editor } from '@tiptap/react';

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type='button'
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // keep editor focus
        onClick();
      }}
      className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className='mx-1 h-5 w-px bg-border' />;
}

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const chain = () => editor.chain().focus();

  return (
    <div className='flex flex-wrap items-center gap-0.5 rounded-t-md border border-b-0 border-border bg-muted/50 px-2 py-1.5'>
      {/* Text style */}
      <ToolbarButton
        title='Bold'
        active={editor.isActive('bold')}
        onClick={() => chain().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        title='Italic'
        active={editor.isActive('italic')}
        onClick={() => chain().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>

      <Divider />

      {/* Headings */}
      <ToolbarButton
        title='Heading 1'
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => chain().toggleHeading({ level: 1 }).run()}
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        title='Heading 2'
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title='Heading 3'
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => chain().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        title='Paragraph'
        active={editor.isActive('paragraph')}
        onClick={() => chain().setParagraph().run()}
      >
        P
      </ToolbarButton>

      <Divider />

      {/* Lists & blocks */}
      <ToolbarButton
        title='Bullet list'
        active={editor.isActive('bulletList')}
        onClick={() => chain().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        title='Inline code'
        active={editor.isActive('code')}
        onClick={() => chain().toggleCode().run()}
      >
        {'</>'}
      </ToolbarButton>
      <ToolbarButton
        title='Code block'
        active={editor.isActive('codeBlock')}
        onClick={() => chain().toggleCodeBlock().run()}
      >
        {'{ }'}
      </ToolbarButton>
      <ToolbarButton
        title='Horizontal rule'
        active={false}
        onClick={() => chain().setHorizontalRule().run()}
      >
        —
      </ToolbarButton>
    </div>
  );
}
