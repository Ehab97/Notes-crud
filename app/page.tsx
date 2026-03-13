import Link from 'next/link';
import { HeroCTA } from '@/components/HeroCTA';

const features = [
  {
    title: 'Rich text editing',
    description: 'Write notes with a full-featured editor — headings, code blocks, and more.',
  },
  {
    title: 'Share publicly',
    description: 'Toggle any note public and share it with a simple link.',
  },
  {
    title: 'Simple & fast',
    description: 'No clutter. Just your notes, stored locally with zero setup.',
  },
];

export default function HomePage() {
  return (
    <main>
      <section className='mx-auto max-w-3xl px-4 py-24 text-center'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>Notes, simplified.</h1>
        <p className='mt-4 text-lg text-muted-foreground'>
          A minimal note-taking app with rich text editing and one-click public sharing.
        </p>
        <HeroCTA />
      </section>

      <section className='mx-auto max-w-4xl px-4 pb-24'>
        <div className='grid gap-6 sm:grid-cols-3'>
          {features.map((f) => (
            <div key={f.title} className='rounded-lg border border-border bg-card p-6'>
              <h3 className='font-semibold'>{f.title}</h3>
              <p className='mt-2 text-sm text-muted-foreground'>{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
