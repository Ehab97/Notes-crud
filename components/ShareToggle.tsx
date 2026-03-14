'use client';

import { useState } from 'react';
import { useToast } from './Toast';

interface ShareToggleProps {
  noteId: string;
  initialIsPublic: boolean;
  initialSlug: string | null;
}

export default function ShareToggle({ noteId, initialIsPublic, initialSlug }: ShareToggleProps) {
  const toast = useToast();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [slug, setSlug] = useState<string | null>(initialSlug);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = slug ? `${window.location.origin}/p/${slug}` : null;

  async function handleEnable() {
    setLoading(true);
    const res = await fetch(`/api/notes/${noteId}/share`, { method: 'POST' });
    if (!res.ok) {
      toast('Failed to enable sharing.', 'error');
      setLoading(false);
      return;
    }
    const data = await res.json();
    setSlug(data.slug);
    setIsPublic(true);
    setLoading(false);
    toast('Note is now public.', 'success');
  }

  async function handleDisable() {
    setLoading(true);
    const res = await fetch(`/api/notes/${noteId}/share`, { method: 'DELETE' });
    if (!res.ok) {
      toast('Failed to disable sharing.', 'error');
      setLoading(false);
      return;
    }
    setSlug(null);
    setIsPublic(false);
    setLoading(false);
    toast('Note is now private.', 'success');
  }

  async function handleCopy() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast('Link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isPublic) {
    return (
      <button
        onClick={handleEnable}
        disabled={loading}
        className='rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50'
      >
        {loading ? 'Enabling...' : 'Share publicly'}
      </button>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <input
        readOnly
        value={publicUrl ?? ''}
        className='rounded-md border px-3 py-2 text-sm font-mono bg-muted w-64 truncate'
      />
      <button
        onClick={handleCopy}
        className='rounded-md border px-3 py-2 text-sm hover:bg-muted'
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <button
        onClick={handleDisable}
        disabled={loading}
        className='rounded-md border px-3 py-2 text-sm text-destructive hover:bg-muted disabled:opacity-50'
      >
        {loading ? 'Disabling...' : 'Turn off'}
      </button>
    </div>
  );
}
