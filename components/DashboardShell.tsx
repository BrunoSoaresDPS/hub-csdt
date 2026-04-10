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

export default function DashboardShell() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    return params.toString();
  }, [filters]);

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

  useEffect(() => {
    loadProjects();
  }, []);

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
        onChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
        onApply={loadProjects}
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
    </div>
  );
}
