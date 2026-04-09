'use client';

import { projectStatuses, priorityLabels } from '../lib/validators';

interface ProjectFiltersProps {
  filters: {
    status: string;
    owner: string;
    priority: string;
    search: string;
    startDate: string;
    endDate: string;
  };
  onChange: (field: string, value: string) => void;
  onApply: () => void;
}

export default function ProjectFilters({ filters, onChange, onApply }: ProjectFiltersProps) {
  return (
    <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-soft sm:grid-cols-3">
      <div className="space-y-3">
        <label className="block text-sm text-slate-300">Pesquisa</label>
        <input value={filters.search} onChange={(e) => onChange('search', e.target.value)} placeholder="Buscar projeto ou descrição" className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none" />
      </div>
      <div className="space-y-3">
        <label className="block text-sm text-slate-300">Status</label>
        <select value={filters.status} onChange={(e) => onChange('status', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none">
          <option value="">Todos</option>
          {Object.entries(projectStatuses).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-3">
        <label className="block text-sm text-slate-300">Prioridade</label>
        <select value={filters.priority} onChange={(e) => onChange('priority', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none">
          <option value="">Todas</option>
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-3 sm:col-span-3">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">Data de início</label>
          <label className="block text-sm text-slate-300">Data de término</label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input type="date" value={filters.startDate} onChange={(e) => onChange('startDate', e.target.value)} className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none" />
          <input type="date" value={filters.endDate} onChange={(e) => onChange('endDate', e.target.value)} className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none" />
        </div>
      </div>
      <button type="button" onClick={onApply} className="sm:col-span-3 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
        Aplicar filtros
      </button>
    </div>
  );
}
