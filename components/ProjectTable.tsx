'use client';

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
  startDate: string;
  endDate: string;
  updatedAt: string;
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

export default function ProjectTable({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="iveco-card flex flex-col items-center justify-center py-16 text-center">
        <svg className="mb-3 h-8 w-8 text-[#333340]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium text-[#555562]">Nenhum projeto encontrado</p>
        <p className="mt-1 text-xs text-[#333340]">Tente ajustar os filtros ou aguarde novos cadastros.</p>
      </div>
    );
  }

  return (
    <div className="iveco-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#232329] bg-[#17171b]">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#555562]">Projeto</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#555562]">Categorias</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#555562]">Responsável</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#555562]">Status</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#555562]">Prioridade</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#555562]">Complexidade</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#555562]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17171b]">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="group transition-colors hover:bg-[#131316]"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-white">{project.title}</p>
                  <p className="mt-0.5 text-xs text-[#555562]">
                    Atualizado em {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                  </p>
                </td>
                <td className="px-5 py-4">
                  {(() => {
                    try {
                      const cats = JSON.parse(project.categories || '[]');
                      const displayedCats = cats.slice(0, 2);
                      const remaining = cats.length - 2;
                      return (
                        <div className="flex flex-wrap gap-1">
                          {displayedCats.map((cat: string) => (
                            <span key={cat} className="inline-flex rounded-full border border-[#1654FF]/25 bg-[#1654FF]/10 px-2.5 py-0.5 text-xs font-medium text-[#7B9FFF]">
                              {cat}
                            </span>
                          ))}
                          {remaining > 0 && (
                            <span className="inline-flex rounded-full border border-[#1654FF]/25 bg-[#1654FF]/10 px-2.5 py-0.5 text-xs font-medium text-[#7B9FFF]">
                              +{remaining} mais
                            </span>
                          )}
                        </div>
                      );
                    } catch {
                      return <span className="text-[#9999a8]">—</span>;
                    }
                  })()}
                </td>
                <td className="px-5 py-4 text-[#9999a8]">{project.owner}</td>
                <td className="px-5 py-4">
                  <StatusPill value={project.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${priorityDot[project.priority] ?? 'bg-slate-500'}`} />
                    <span className="text-[#9999a8]">
                      {priorityLabels[project.priority as keyof typeof priorityLabels] ?? project.priority}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${complexityBadge[project.complexity] ?? complexityBadge.MEDIUM}`}>
                    {complexityLabels[project.complexity as keyof typeof complexityLabels] ?? project.complexity}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#232329] bg-[#17171b] px-3 py-1.5 text-xs font-semibold text-[#9999a8] transition-colors hover:border-[#1654FF]/50 hover:bg-[#1654FF]/10 hover:text-[#7B9FFF]"
                  >
                    Ver detalhes
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
