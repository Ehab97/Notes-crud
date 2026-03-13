import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
  return (
    <main className='min-h-screen flex items-center justify-center px-4'>
      <Suspense>
        <AuthForm />
      </Suspense>
    </main>
  );
}
