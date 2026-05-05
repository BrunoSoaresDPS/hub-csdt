'use client';

import { useEffect, useMemo, useState } from 'react';
import ProjectFilters from './ProjectFilters';
import ProjectTable from './ProjectTable';

interface Project {
  id: string;
  title: string;
  owner: string;
  status: string;
  priority: string;
  complexity: string;
  categories: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
}

const PAGE_SIZE = 10;

export default function DashboardShell() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    owner: '',
    priority: '',
    complexity: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', String(page));
    params.set('pageSize', String(PAGE_SIZE));
    return params.toString();
  }, [filters, page]);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/projects?${query}`);
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Erro ao carregar projetos.');
          return;
        }
        const data = await response.json();
        setProjects(data.projects);
        setTotal(data.total);
      } catch {
        setError('Erro de conexão.');
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [query]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Projetos</h2>
          <p className="mt-0.5 text-sm text-[#555562]">
            {total > 0 ? `${total} projeto${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''}` : 'Nenhum projeto encontrado'}
          </p>
        </div>
      </div>

      <ProjectFilters
        filters={filters}
        onChange={(field, value) => {
          setPage(1);
          setFilters((prev) => ({ ...prev, [field]: value }));
        }}
        onApply={() => {
          setPage(1);
        }}
      />

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="iveco-card flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-6 w-6 animate-spin text-[#1654FF]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm text-[#555562]">Carregando projetos...</p>
          </div>
        </div>
      ) : (
        <ProjectTable projects={projects} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-[#555562]">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#232329] bg-[#17171b] px-3 py-1.5 text-sm font-medium text-[#d4d4d8] transition-colors hover:border-[#1654FF]/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            {(() => {
              const pages: (number | '...')[] = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (page > 3) pages.push('...');
                for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                  pages.push(i);
                }
                if (page < totalPages - 2) pages.push('...');
                pages.push(totalPages);
              }
              return pages.map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-sm text-[#555562]">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[32px] rounded-lg border px-2 py-1.5 text-sm font-medium transition-colors ${
                      page === p
                        ? 'border-[#1654FF] bg-[#1654FF]/15 text-white'
                        : 'border-[#232329] bg-[#17171b] text-[#d4d4d8] hover:border-[#1654FF]/50 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                )
              );
            })()}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#232329] bg-[#17171b] px-3 py-1.5 text-sm font-medium text-[#d4d4d8] transition-colors hover:border-[#1654FF]/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
