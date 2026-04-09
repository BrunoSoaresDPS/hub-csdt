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
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="iveco-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="iveco-label">Filtros</p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              const empty = { status: '', owner: '', priority: '', search: '', startDate: '', endDate: '' };
              Object.entries(empty).forEach(([k, v]) => onChange(k, v));
            }}
            className="text-xs text-[#555562] transition-colors hover:text-white"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="iveco-label mb-1.5 block">Busca</label>
          <input
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Título ou descrição..."
            className="iveco-input"
          />
        </div>

        <div>
          <label className="iveco-label mb-1.5 block">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
            className="iveco-input"
          >
            <option value="">Todos os status</option>
            {Object.entries(projectStatuses).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="iveco-label mb-1.5 block">Prioridade</label>
          <select
            value={filters.priority}
            onChange={(e) => onChange('priority', e.target.value)}
            className="iveco-input"
          >
            <option value="">Todas</option>
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="iveco-label mb-1.5 block">Responsável</label>
          <input
            value={filters.owner}
            onChange={(e) => onChange('owner', e.target.value)}
            placeholder="Nome do responsável"
            className="iveco-input"
          />
        </div>

        <div>
          <label className="iveco-label mb-1.5 block">Início após</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            className="iveco-input"
          />
        </div>

        <div>
          <label className="iveco-label mb-1.5 block">Término até</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
            className="iveco-input"
          />
        </div>

        <div className="flex items-end sm:col-span-2">
          <button
            type="button"
            onClick={onApply}
            className="iveco-btn-primary w-full py-2.5"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
