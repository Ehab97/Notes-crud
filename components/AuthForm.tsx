'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/auth-client';

export default function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isRegister = searchParams.get('mode') === 'register';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const { error } = await signUp.email({
          email,
          password,
          name: email.split('@')[0],
        });
        if (error) {
          setError(error.message ?? 'Registration failed');
          setLoading(false);
          return;
        }
      } else {
        const { error } = await signIn.email({ email, password });
        if (error) {
          setError(error.message ?? 'Login failed');
          setLoading(false);
          return;
        }
      }
      router.push('/dashboard');
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className='w-full max-w-sm mx-auto'>
      <div className='rounded-lg border border-border bg-card p-6'>
        <h1 className='mb-6 text-center text-xl font-semibold'>
          {isRegister ? 'Create account' : 'Log in'}
        </h1>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading} className='space-y-4'>
            <div>
              <label htmlFor='email' className='mb-1 block text-sm font-medium'>
                Email
              </label>
              <input
                id='email'
                type='email'
                required
                autoComplete={isRegister ? 'email' : 'username'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
                placeholder='you@example.com'
              />
            </div>

            <div>
              <label htmlFor='password' className='mb-1 block text-sm font-medium'>
                Password
              </label>
              <input
                id='password'
                type='password'
                required
                minLength={8}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
                placeholder='Min 8 characters'
              />
            </div>

            <p aria-live='polite' className='text-sm text-destructive empty:hidden'>
              {error}
            </p>

            <button
              type='submit'
              className='w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
            >
              {loading ? '...' : isRegister ? 'Create account' : 'Log in'}
            </button>
          </fieldset>
        </form>

        <p className='mt-4 text-center text-sm text-muted-foreground'>
          {isRegister ? (
            <>
              Already have an account?{' '}
              <Link href='/auth' className='text-primary hover:underline'>
                Log in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <Link href='/auth?mode=register' className='text-primary hover:underline'>
                Create one
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
