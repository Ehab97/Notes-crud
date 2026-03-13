'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className='sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm'>
      <div className='mx-auto flex h-14 max-w-5xl items-center justify-between px-4'>
        <Link href='/' className='text-lg font-semibold'>
          NoteApp
        </Link>

        <nav className='flex items-center gap-4'>
          {session?.user ? (
            <>
              <Link
                href='/dashboard'
                className='text-sm text-muted-foreground hover:text-foreground'
              >
                Dashboard
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/');
                }}
                className='text-sm text-muted-foreground hover:text-foreground'
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href='/auth' className='text-sm text-muted-foreground hover:text-foreground'>
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
