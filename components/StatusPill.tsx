'use client';

import { projectStatuses } from '../lib/validators';

const colorMap: Record<string, string> = {
  REVIEW: 'bg-amber-500/15 text-amber-200',
  APPROVED: 'bg-emerald-500/15 text-emerald-200',
  IN_PROGRESS: 'bg-sky-500/15 text-sky-200',
  COMPLETED: 'bg-violet-500/15 text-violet-200',
};

export default function StatusPill({ value }: { value: string }) {
  const label = projectStatuses[value as keyof typeof projectStatuses] ?? value.replace('_', ' ');
  const color = colorMap[value] ?? 'bg-slate-700 text-slate-100';
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{label}</span>;
}
