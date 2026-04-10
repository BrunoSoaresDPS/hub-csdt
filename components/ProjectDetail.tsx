'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusPill from './StatusPill';
import { projectStatuses, priorityLabels, complexityLabels, impactFinancialLabels, impactTimeLabels } from '../lib/validators';

interface TaskProject {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: string;
  priority: string;
  complexity: string;
  categories: string;
  impactFinancial?: string;
  impactTime?: string;
  additionalQuestions?: string;
  startDate: string;
  endDate: string;
  fileUrl?: string;
  changeLogs: { id: string; message: string; createdAt: string }[];
}

const priorityDot: Record<string, string> = {
  HIGH: 'bg-rose-400',
  MEDIUM: 'bg-amber-400',
  LOW: 'bg-slate-500',
};

const complexityBadge: Record<string, string> = {
  HIGH: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  MEDIUM: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  LOW: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
};

export default function ProjectDetail({ id }: { id: string }) {
  const [project, setProject] = useState<TaskProject | null>(null);
  const [form, setForm] = useState({ status: '', priority: '', changeLog: '' });
  const [message, setMessage] = useState({ text: '', success: false });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentMessage, setCommentMessage] = useState({ text: '', success: false });
  const router = useRouter();

  useEffect(() => {
    async function fetchProject() {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) return setMessage({ text: 'Falha ao carregar detalhes.', success: false });
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
    setMessage({ text: '', success: false });
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: form.status, priority: form.priority, changeLog: form.changeLog }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage({ text: data.error || 'Erro ao atualizar.', success: false });
      return;
    }
    setMessage({ text: 'Projeto atualizado com sucesso.', success: true });
    setForm((prev) => ({ ...prev, changeLog: '' }));
    router.refresh();
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setCommentLoading(true);
    setCommentMessage({ text: '', success: false });
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changeLog: comment }),
    });
    setCommentLoading(false);
    if (!res.ok) {
      setCommentMessage({ text: 'Erro ao adicionar comentário.', success: false });
      return;
    }
    setCommentMessage({ text: 'Comentário adicionado.', success: true });
    setComment('');
    router.refresh();
    // Reload project to show new log
    const updated = await fetch(`/api/projects/${id}`);
    if (updated.ok) {
      const data = await updated.json();
      setProject(data.project);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Deseja realmente excluir este projeto? Esta ação não pode ser desfeita.')) return;
    setDeleting(true);
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ text: data.error || 'Erro ao excluir.', success: false });
      setDeleting(false);
      return;
    }
    router.push('/dashboard');
  };

  if (!project) {
    return (
      <div className="iveco-card flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-6 w-6 animate-spin text-[#1654FF]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-[#555562]">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Project header */}
      <div className="iveco-card iveco-border-l rounded-l-none p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill value={project.status} />
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${priorityDot[project.priority] ?? 'bg-slate-500'}`} />
                <span className="text-xs text-[#9999a8]">
                  Prioridade {priorityLabels[project.priority as keyof typeof priorityLabels] ?? project.priority}
                </span>
              </div>
              {(() => {
                try {
                  const cats = JSON.parse(project.categories || '[]');
                  return cats.map((cat: string) => (
                    <span key={cat} className="inline-flex rounded-full border border-[#1654FF]/25 bg-[#1654FF]/10 px-2.5 py-0.5 text-xs font-medium text-[#7B9FFF]">
                      {cat}
                    </span>
                  ));
                } catch {
                  return null;
                }
              })()}
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${complexityBadge[project.complexity] ?? complexityBadge.MEDIUM}`}>
                Complexidade {complexityLabels[project.complexity as keyof typeof complexityLabels] ?? project.complexity}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{project.title}</h2>
            <p className="max-w-2xl text-sm text-[#9999a8] leading-relaxed">{project.description}</p>
          </div>
          {project.fileUrl && (
            <a
              href={project.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#232329] bg-[#17171b] px-3 py-2 text-xs font-medium text-[#9999a8] transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Ver arquivo
            </a>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Responsável', value: project.owner },
            {
              label: 'Início',
              value: new Date(project.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
            },
            {
              label: 'Término previsto',
              value: new Date(project.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
            },
            project.impactFinancial && {
              label: 'Impacto Financeiro',
              value: impactFinancialLabels[project.impactFinancial as keyof typeof impactFinancialLabels],
            },
            project.impactTime && {
              label: 'Prazo',
              value: impactTimeLabels[project.impactTime as keyof typeof impactTimeLabels],
            },
          ].filter(Boolean).map((item: any) => (
            <div key={item.label} className="rounded-lg border border-[#232329] bg-[#17171b] px-4 py-3">
              <p className="iveco-label">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {project.additionalQuestions && (() => {
          try {
            const answers = JSON.parse(project.additionalQuestions);
            if (Object.keys(answers).length > 0) {
              return (
                <div className="mt-5 iveco-card p-4">
                  <p className="iveco-label mb-3">Informações Adicionais</p>
                  <ul className="space-y-2">
                    {Object.entries(answers).map(([key, value]) => (
                      <li key={key} className="text-sm text-[#9999a8]">
                        <span className="text-white font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
          } catch {
            return null;
          }
        })()}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Update form */}
        <form onSubmit={handleUpdate} className="iveco-card p-6 space-y-4">
          <div className="border-b border-[#232329] pb-4">
            <h3 className="text-base font-bold text-white">Atualizar projeto</h3>
            <p className="mt-0.5 text-sm text-[#555562]">Altere o status, prioridade ou registre uma nota.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="iveco-label mb-1.5 block">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="iveco-input"
              >
                {Object.entries(projectStatuses).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="iveco-label mb-1.5 block">Prioridade</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                className="iveco-input"
              >
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="iveco-label mb-1.5 block">Registro da atualização</label>
            <textarea
              value={form.changeLog}
              onChange={(e) => setForm((prev) => ({ ...prev, changeLog: e.target.value }))}
              className="iveco-input resize-none"
              placeholder="Descreva a alteração realizada..."
              rows={4}
            />
          </div>

          {message.text && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                message.success
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="iveco-btn-primary flex-1 py-2.5"
            >
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
            >
              {deleting ? 'Excluindo...' : 'Excluir projeto'}
            </button>
          </div>
        </form>

        {/* Comments + Change log */}
        <div className="space-y-4">
          {/* Add comment */}
          <div className="iveco-card p-5">
            <div className="mb-4 border-b border-[#232329] pb-4">
              <h3 className="text-base font-bold text-white">Adicionar comentário</h3>
              <p className="mt-0.5 text-xs text-[#555562]">Registre observações sem alterar o status do projeto.</p>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="iveco-input resize-none w-full mb-3"
              placeholder="Digite seu comentário..."
              rows={3}
            />
            {commentMessage.text && (
              <div className={`mb-3 rounded-lg border px-3 py-2 text-sm ${
                commentMessage.success
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              }`}>
                {commentMessage.text}
              </div>
            )}
            <button
              type="button"
              onClick={handleAddComment}
              disabled={commentLoading || !comment.trim()}
              className="iveco-btn-primary w-full py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commentLoading ? 'Enviando...' : 'Comentar'}
            </button>
          </div>

          {/* Change log */}
          <div className="iveco-card p-5">
            <div className="mb-4 border-b border-[#232329] pb-4">
              <h3 className="text-base font-bold text-white">Histórico</h3>
              <p className="mt-0.5 text-xs text-[#555562]">{project.changeLogs.length} registro{project.changeLogs.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-80">
              {project.changeLogs.length === 0 ? (
                <p className="text-sm text-[#555562]">Sem registros.</p>
              ) : (
                project.changeLogs.map((log) => (
                  <div key={log.id} className="rounded-lg border border-[#232329] bg-[#17171b] p-3">
                    <p className="text-xs text-[#9999a8] leading-relaxed">{log.message}</p>
                    <p className="mt-2 text-[10px] text-[#333340]">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
