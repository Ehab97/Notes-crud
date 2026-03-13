'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';

export function HeroCTA() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className='mt-8'>
        <Link
          href='/dashboard'
          className='rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90'
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className='mt-8 flex items-center justify-center gap-4'>
      <Link
        href='/auth?mode=register'
        className='rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90'
      >
        Get started
      </Link>
      <Link
        href='/auth'
        className='rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent'
      >
        Log in
      </Link>
    </div>
  );
}
