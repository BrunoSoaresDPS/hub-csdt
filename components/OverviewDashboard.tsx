'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StatsData {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byComplexity: Record<string, number>;
  byCategory: Record<string, number>;
  recentProjects: {
    id: string;
    title: string;
    owner: string;
    status: string;
    priority: string;
    createdAt: string;
  }[];
  monthlyTrend: { month: string; count: number }[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  REVIEW:      { label: 'Em análise',    color: 'text-amber-300',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   dot: 'bg-amber-400' },
  APPROVED:    { label: 'Aprovado',      color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  IN_PROGRESS: { label: 'Em andamento',  color: 'text-[#7B9FFF]',   bg: 'bg-[#1654FF]/10',   border: 'border-[#1654FF]/30',   dot: 'bg-[#1654FF]' },
  COMPLETED:   { label: 'Concluído',     color: 'text-slate-400',   bg: 'bg-slate-500/10',   border: 'border-slate-500/30',   dot: 'bg-slate-500' },
};

const priorityConfig: Record<string, { label: string; bar: string; text: string }> = {
  HIGH:   { label: 'Alta',  bar: 'bg-rose-500',    text: 'text-rose-300' },
  MEDIUM: { label: 'Média', bar: 'bg-amber-500',   text: 'text-amber-300' },
  LOW:    { label: 'Baixa', bar: 'bg-slate-500',   text: 'text-slate-400' },
};

const complexityConfig: Record<string, { label: string; bar: string; text: string }> = {
  HIGH:   { label: 'Alta',  bar: 'bg-rose-500',    text: 'text-rose-300' },
  MEDIUM: { label: 'Média', bar: 'bg-amber-500',   text: 'text-amber-300' },
  LOW:    { label: 'Baixa', bar: 'bg-emerald-500', text: 'text-emerald-300' },
};

function BarRow({ label, value, max, barClass, textClass }: {
  label: string; value: number; max: number; barClass: string; textClass: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-right text-xs text-[#9999a8]">{label}</span>
      <div className="flex-1 rounded-full bg-[#17171b] h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`w-6 shrink-0 text-right text-xs font-semibold ${textClass}`}>{value}</span>
    </div>
  );
}

export default function OverviewDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/projects/stats');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStats(data);
      } catch {
        setError('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-6 w-6 animate-spin text-[#1654FF]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-[#555562]">Carregando visão geral...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
        {error || 'Dados indisponíveis.'}
      </div>
    );
  }

  const maxPriority = Math.max(...Object.values(stats.byPriority), 1);
  const maxComplexity = Math.max(...Object.values(stats.byComplexity), 1);
  const trendMax = Math.max(...stats.monthlyTrend.map((m) => m.count), 1);

  const sortedCategories = Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxCategory = sortedCategories[0]?.[1] || 1;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Visão Geral</h2>
        <p className="mt-0.5 text-sm text-[#555562]">Resumo consolidado de todos os projetos</p>
      </div>

      {/* KPI cards — status breakdown */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total */}
        <div className="iveco-card p-5 col-span-2 sm:col-span-1 flex flex-col justify-between">
          <p className="iveco-label">Total</p>
          <p className="mt-2 text-4xl font-bold text-white">{stats.total}</p>
          <p className="mt-1 text-xs text-[#555562]">projetos registrados</p>
        </div>

        {(['REVIEW', 'IN_PROGRESS', 'APPROVED', 'COMPLETED'] as const).map((key) => {
          const cfg = statusConfig[key];
          const count = stats.byStatus[key] ?? 0;
          const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
          return (
            <div key={key} className={`iveco-card p-5 flex flex-col justify-between border ${cfg.border}`}>
              <div className="flex items-center justify-between">
                <p className="iveco-label">{cfg.label}</p>
                <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
              </div>
              <p className={`mt-2 text-3xl font-bold ${cfg.color}`}>{count}</p>
              <p className="mt-1 text-xs text-[#555562]">{pct}% do total</p>
            </div>
          );
        })}
      </div>

      {/* Priority + Complexity */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="iveco-card p-5 space-y-4">
          <p className="iveco-label">Prioridade</p>
          <div className="space-y-3 pt-1">
            {(['HIGH', 'MEDIUM', 'LOW'] as const).map((key) => (
              <BarRow
                key={key}
                label={priorityConfig[key].label}
                value={stats.byPriority[key] ?? 0}
                max={maxPriority}
                barClass={priorityConfig[key].bar}
                textClass={priorityConfig[key].text}
              />
            ))}
          </div>
        </div>

        <div className="iveco-card p-5 space-y-4">
          <p className="iveco-label">Complexidade</p>
          <div className="space-y-3 pt-1">
            {(['HIGH', 'MEDIUM', 'LOW'] as const).map((key) => (
              <BarRow
                key={key}
                label={complexityConfig[key].label}
                value={stats.byComplexity[key] ?? 0}
                max={maxComplexity}
                barClass={complexityConfig[key].bar}
                textClass={complexityConfig[key].text}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories + Monthly trend */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Categories */}
        <div className="iveco-card p-5 space-y-4">
          <p className="iveco-label">Categorias</p>
          {sortedCategories.length === 0 ? (
            <p className="text-sm text-[#555562]">Nenhuma categoria registrada.</p>
          ) : (
            <div className="space-y-3 pt-1">
              {sortedCategories.map(([cat, count]) => {
                const pct = maxCategory > 0 ? Math.round((count / maxCategory) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-xs text-[#9999a8]">{cat}</span>
                    <div className="flex-1 rounded-full bg-[#17171b] h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1654FF] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right text-xs font-semibold text-[#7B9FFF]">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Monthly trend */}
        <div className="iveco-card p-5 space-y-4">
          <p className="iveco-label">Últimos 6 meses</p>
          <div className="flex items-end gap-2 h-28">
            {stats.monthlyTrend.map((m) => {
              const heightPct = trendMax > 0 ? Math.round((m.count / trendMax) * 100) : 0;
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#9999a8]">
                    {m.count > 0 ? m.count : ''}
                  </span>
                  <div className="w-full rounded-t-sm bg-[#17171b] flex items-end" style={{ height: '72px' }}>
                    <div
                      className="w-full rounded-t-sm bg-[#1654FF] transition-all duration-700"
                      style={{ height: `${Math.max(heightPct, m.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#555562] capitalize">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div className="iveco-card overflow-hidden">
        <div className="border-b border-[#232329] px-5 py-4">
          <p className="iveco-label">Projetos recentes</p>
        </div>
        {stats.recentProjects.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-[#555562]">Nenhum projeto cadastrado.</p>
        ) : (
          <ul className="divide-y divide-[#17171b]">
            {stats.recentProjects.map((p) => {
              const cfg = statusConfig[p.status];
              return (
                <li key={p.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#131316] transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{p.title}</p>
                    <p className="mt-0.5 text-xs text-[#555562]">{p.owner} · {new Date(p.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    {cfg && (
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.border} ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    )}
                    <Link
                      href={`/dashboard/projects/${p.id}`}
                      className="shrink-0 rounded-lg border border-[#232329] bg-[#17171b] px-3 py-1.5 text-xs font-semibold text-[#9999a8] transition-colors hover:border-[#1654FF]/50 hover:bg-[#1654FF]/10 hover:text-[#7B9FFF]"
                    >
                      Ver
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
