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
  startDate: string;
  endDate: string;
  updatedAt: string;
}

export default function DashboardShell() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({ status: '', owner: '', priority: '', search: '', startDate: '', endDate: '' });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  async function loadProjects() {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`/api/projects?${query}`);
      if (!response.ok) {
        const data = await response.json();
        setMessage(data.error || 'Erro ao carregar projetos.');
        return;
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      setMessage('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="space-y-6">
      <ProjectFilters filters={filters} onChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))} onApply={loadProjects} />

      {message ? <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">{message}</div> : null}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-10 text-center text-slate-200">Carregando projetos...</div>
      ) : (
        <ProjectTable projects={projects} />
      )}
    </div>
  );
}
