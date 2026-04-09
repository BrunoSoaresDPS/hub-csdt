'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusPill from './StatusPill';

interface TaskProject {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  fileUrl?: string;
  changeLogs: { id: string; message: string; createdAt: string }[];
}

export default function ProjectDetail({ id }: { id: string }) {
  const [project, setProject] = useState<TaskProject | null>(null);
  const [form, setForm] = useState({ status: '', priority: '', changeLog: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchProject() {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) return setMessage('Falha ao carregar detalhes.');
      const data = await res.json();
      setProject(data.project);
      setForm({ status: data.project.status, priority: data.project.priority, changeLog: '' });
    }
    fetchProject();
  }, [id]);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!project) return;
    setLoading(true);
    setMessage('');
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: form.status, priority: form.priority, changeLog: form.changeLog }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Erro ao atualizar.');
      setLoading(false);
      return;
    }
    setMessage('Projeto atualizado com sucesso.');
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('Deseja realmente excluir este projeto?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || 'Erro ao excluir.');
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-soft">
      {project ? (
        <>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill value={project.status} />
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{project.priority}</span>
              </div>
              <h2 className="text-3xl font-semibold text-white">{project.title}</h2>
              <p className="text-sm text-slate-400">{project.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Responsável</p>
                  <p className="mt-2 text-white">{project.owner}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Período</p>
                  <p className="mt-2 text-white">{new Date(project.startDate).toLocaleDateString()} – {new Date(project.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              {project.fileUrl ? (
                <a href={project.fileUrl} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
                  Ver arquivo enviado
                </a>
              ) : null}
            </div>
            <div className="space-y-4 rounded-3xl bg-slate-900/80 p-6">
              <h3 className="text-lg font-semibold text-white">Histórico de alterações</h3>
              <div className="space-y-3">
                {project.changeLogs.map((log) => (
                  <div key={log.id} className="rounded-2xl border border-white/10 bg-slate-950/90 p-4">
                    <p className="text-sm text-slate-300">{log.message}</p>
                    <p className="mt-2 text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">Atualizar projeto</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-300">Status</span>
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none">
                  <option value="REVIEW">Em análise</option>
                  <option value="APPROVED">Aprovado</option>
                  <option value="IN_PROGRESS">Em andamento</option>
                  <option value="COMPLETED">Concluído</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-slate-300">Prioridade</span>
                <select value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none">
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-300">Registro da atualização</span>
              <textarea value={form.changeLog} onChange={(e) => setForm((prev) => ({ ...prev, changeLog: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none" placeholder="Descreva a alteração realizada..." rows={4} />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="submit" disabled={loading} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60">
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </button>
              <button type="button" onClick={handleDelete} className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20">
                Excluir projeto
              </button>
            </div>
            {message ? <p className={`text-sm ${message.includes('sucesso') ? 'text-emerald-300' : 'text-rose-300'}`}>{message}</p> : null}
          </form>
        </>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-slate-300">Carregando detalhes do projeto...</div>
      )}
    </div>
  );
}
