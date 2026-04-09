'use client';

export default function StatusPill({ value }: { value: string }) {
  const map: Record<string, string> = {
    REVIEW: 'bg-amber-500/15 text-amber-200',
    APPROVED: 'bg-emerald-500/15 text-emerald-200',
    IN_PROGRESS: 'bg-sky-500/15 text-sky-200',
    COMPLETED: 'bg-violet-500/15 text-violet-200',
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${map[value] ?? 'bg-slate-700 text-slate-100'}`}>{value.replace('_', ' ')}</span>;
}
