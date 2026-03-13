export default function DashboardLoading() {
  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='h-8 w-32 animate-pulse rounded bg-muted' />
        <div className='h-9 w-24 animate-pulse rounded-md bg-muted' />
      </div>
      <ul className='space-y-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className='flex items-center justify-between rounded-md border border-border px-4 py-3'>
            <div className='h-5 w-48 animate-pulse rounded bg-muted' />
            <div className='h-4 w-20 animate-pulse rounded bg-muted' />
          </li>
        ))}
      </ul>
    </main>
  );
}
