'use client';

import { useState } from 'react';
import { projectStatuses, priorityLabels } from '../lib/validators';

export default function HomePage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    owner: '',
    startDate: '',
    endDate: '',
    status: 'REVIEW',
    priority: 'MEDIUM',
  });
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    const response = await fetch('/api/projects/public', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus({ loading: false, message: data.error || 'Erro ao enviar projeto.', error: true });
      return;
    }

    setStatus({ loading: false, message: 'Projeto enviado com sucesso! Obrigado.', error: false });
    setForm({ title: '', description: '', owner: '', startDate: '', endDate: '', status: 'REVIEW', priority: 'MEDIUM' });
  };

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              HUB DE PROJETOS • CRM
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Cadastre seu projeto com rapidez e segurança.
            </h1>
            <p className="max-w-xl text-slate-300">
              Qualquer pessoa pode registrar novos projetos. O time responsável receberá as informações e poderá gerenciar tudo no painel administrativo.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Status</p>
                <p className="mt-2 text-xl font-semibold text-white">Em análise</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Entrega</p>
                <p className="mt-2 text-xl font-semibold text-white">Fluxo moderno</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-slate-900/95 p-8 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Novo projeto</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Formulário público</h2>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">Sem login</span>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-300">Nome do projeto</span>
                <input required value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Projeto Aurora" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400" />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Descrição detalhada</span>
                <textarea required value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Objetivos, escopo e pontos-chave..." rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400" />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Responsável</span>
                <input required value={form.owner} onChange={(e) => handleChange('owner', e.target.value)} placeholder="Nome do responsável" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-slate-300">Data de início</span>
                  <input required type="date" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400" />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Data prevista</span>
                  <input required type="date" value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-slate-300">Status</span>
                  <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400">
                    {Object.entries(projectStatuses).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Prioridade</span>
                  <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400">
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <button type="submit" disabled={status.loading} className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
              {status.loading ? 'Enviando...' : 'Enviar projeto'}
            </button>

            {status.message ? (
              <p className={`mt-4 text-sm ${status.error ? 'text-rose-300' : 'text-emerald-300'}`}>{status.message}</p>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  );
}
