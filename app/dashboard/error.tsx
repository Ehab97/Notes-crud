'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <div className='rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center'>
        <h2 className='mb-2 text-lg font-semibold text-destructive'>Something went wrong</h2>
        <p className='mb-4 text-sm text-muted-foreground'>
          Failed to load your notes. Please try again.
        </p>
        <button
          onClick={reset}
          className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90'
        >
          Try again
        </button>
      </div>
    </main>
  );
}
