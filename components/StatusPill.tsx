'use client';

import { projectStatuses } from '../lib/validators';

const colorMap: Record<string, string> = {
  REVIEW: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  APPROVED: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  IN_PROGRESS: 'border-[#1654FF]/30 bg-[#1654FF]/10 text-[#7B9FFF]',
  COMPLETED: 'border-slate-500/30 bg-slate-500/10 text-slate-400',
};

export default function StatusPill({ value }: { value: string }) {
  const label = projectStatuses[value as keyof typeof projectStatuses] ?? value.replace('_', ' ');
  const color = colorMap[value] ?? 'border-[#232329] bg-[#17171b] text-[#9999a8]';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}
