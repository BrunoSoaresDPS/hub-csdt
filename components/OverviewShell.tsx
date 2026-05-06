'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import StatusPill from './StatusPill';
import { priorityLabels, complexityLabels } from '../lib/validators';

interface Project {
  id: string;
  title: string;
  owner: string;
  status: string;
  priority: string;
  complexity: string;
  categories: string;
  impactFinancial?: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
}

const PRIORITY_SCORE: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
const COMPLEXITY_SCORE: Record<string, number> = { LOW: 3, MEDIUM: 2, HIGH: 1 };
const STATUS_SCORE: Record<string, number> = { APPROVED: 3, VALIDATION: 3, REVIEW: 2, IN_PROGRESS: 1, COMPLETED: 0, OUT_OF_SCOPE: 0 };
const IMPACT_SCORE: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

function scoreProject(p: Project): number {
  return (
    (PRIORITY_SCORE[p.priority] ?? 0) +
    (COMPLEXITY_SCORE[p.complexity] ?? 0) +
    (STATUS_SCORE[p.status] ?? 0) +
    (p.impactFinancial ? IMPACT_SCORE[p.impactFinancial] ?? 0 : 0)
  );
}

const priorityDot: Record<string, string> = {
  HIGH: 'bg-rose-400',
  MEDIUM: 'bg-amber-400',
  LOW: 'bg-slate-400',
};

const complexityBadge: Record<string, string> = {
  HIGH: 'border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-300',
  MEDIUM: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300',
  LOW: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
};

function StatCard({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div className="iveco-card p-5">
      <p className="iveco-label">{label}</p>
      <p className={`mt-2 text-3xl font-black ${accent ?? 'text-gray-900 dark:text-white'}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400 dark:text-[#555562]">{sub}</p>}
    </div>
  );
}

function AttackBadge({ score }: { score: number }) {
  if (score >= 10) return <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Urgente</span>;
  if (score >= 8) return <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Alta prioridade</span>;
  return <span className="rounded-full bg-[#1654FF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Recomendado</span>;
}

export default function OverviewShell() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/projects?pageSize=500');
        if (!res.ok) return;
        const data = await res.json();
        setProjects(data.projects);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const byStatus = projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    }, {});
    const byPriority = projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.priority] = (acc[p.priority] ?? 0) + 1;
      return acc;
    }, {});
    return { byStatus, byPriority };
  }, [projects]);

  const attackProjects = useMemo(() => {
    return projects
      .filter((p) => p.status === 'REVIEW' || p.status === 'VALIDATION' || p.status === 'APPROVED')
      .map((p) => ({ ...p, score: scoreProject(p) }))
      .filter((p) => p.score >= 6)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [projects]);

  const categoryMap = useMemo(() => {
    const map: Record<string, number> = {};
    projects.forEach((p) => {
      try {
        const cats: string[] = JSON.parse(p.categories || '[]');
        cats.forEach((c) => { map[c] = (map[c] ?? 0) + 1; });
      } catch { /* ignore */ }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [projects]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="h-6 w-6 animate-spin text-[#1654FF]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stat cards */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Visão Geral</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          <StatCard label="Total" value={projects.length} sub="projetos registrados" />
          <StatCard label="Em Análise" value={stats.byStatus['REVIEW'] ?? 0} accent="text-amber-500" />
          <StatCard label="Em Validação" value={stats.byStatus['VALIDATION'] ?? 0} accent="text-violet-500" />
          <StatCard label="Aprovados" value={stats.byStatus['APPROVED'] ?? 0} accent="text-emerald-500" />
          <StatCard label="Em Andamento" value={stats.byStatus['IN_PROGRESS'] ?? 0} accent="text-[#1654FF]" />
          <StatCard label="Concluídos" value={stats.byStatus['COMPLETED'] ?? 0} accent="text-slate-500" />
          <StatCard label="Fora de Escopo" value={stats.byStatus['OUT_OF_SCOPE'] ?? 0} accent="text-rose-500" />
          <StatCard label="Alta Prioridade" value={stats.byPriority['HIGH'] ?? 0} accent="text-rose-500" />
        </div>
      </div>

      {/* Projects to attack */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Projetos para Atacar</h3>
            <p className="mt-0.5 text-sm text-gray-400 dark:text-[#555562]">
              Rankeados por prioridade, impacto e facilidade de execução — prontos para iniciar.
            </p>
          </div>
          {attackProjects.length > 0 && (
            <span className="rounded-full border border-[#1654FF]/30 bg-[#1654FF]/10 px-3 py-1 text-xs font-semibold text-[#1654FF]">
              {attackProjects.length} recomendados
            </span>
          )}
        </div>

        {attackProjects.length === 0 ? (
          <div className="iveco-card flex flex-col items-center justify-center py-16 text-center">
            <svg className="mb-3 h-8 w-8 text-gray-300 dark:text-[#333340]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-gray-500 dark:text-[#555562]">Nenhum projeto com alta pontuação no momento</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-[#333340]">Projetos em revisão ou aprovados com alta prioridade aparecerão aqui.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {attackProjects.map((p) => {
              let cats: string[] = [];
              try { cats = JSON.parse(p.categories || '[]'); } catch { /* ignore */ }

              return (
                <div key={p.id} className="iveco-card group p-5 transition-shadow hover:shadow-lg">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${priorityDot[p.priority] ?? 'bg-slate-400'}`} />
                      <StatusPill value={p.status} />
                    </div>
                    <AttackBadge score={p.score} />
                  </div>

                  <h4 className="mb-1 font-bold text-gray-900 dark:text-white">{p.title}</h4>
                  <p className="mb-3 text-xs text-gray-400 dark:text-[#555562]">{p.owner}</p>

                  {cats.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {cats.map((cat) => (
                        <span key={cat} className="inline-flex rounded-full border border-[#1654FF]/20 bg-[#1654FF]/10 px-2 py-0.5 text-[10px] font-medium text-[#1654FF] dark:text-[#7B9FFF]">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${complexityBadge[p.complexity] ?? complexityBadge.MEDIUM}`}>
                      {complexityLabels[p.complexity as keyof typeof complexityLabels]}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-[#555562]">
                      Prioridade {priorityLabels[p.priority as keyof typeof priorityLabels]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-[#232329]/60">
                    <span className="text-[11px] font-semibold text-gray-400 dark:text-[#555562]">Score: {p.score}</span>
                    <Link
                      href={`/dashboard/projects/${p.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:border-[#1654FF]/50 hover:bg-[#1654FF]/10 hover:text-[#1654FF] dark:border-[#232329] dark:bg-[#17171b] dark:text-[#9999a8] dark:hover:text-[#7B9FFF]"
                    >
                      Ver projeto
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Categories */}
      {categoryMap.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Projetos por Categoria</h3>
          <div className="iveco-card overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-[#232329]">
              {categoryMap.map(([cat, count]) => {
                const pct = Math.round((count / projects.length) * 100);
                return (
                  <div key={cat} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="w-44 flex-shrink-0 text-sm font-medium text-gray-700 dark:text-[#d4d4d8]">{cat}</span>
                    <div className="flex-1">
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-[#232329]">
                        <div
                          className="h-full rounded-full bg-[#1654FF] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-16 text-right text-sm font-semibold text-gray-500 dark:text-[#9999a8]">
                      {count} <span className="font-normal text-xs text-gray-400 dark:text-[#555562]">({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
