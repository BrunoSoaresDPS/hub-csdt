'use client';

import Link from 'next/link';
import StatusPill from './StatusPill';
import { priorityLabels } from '../lib/validators';

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

export default function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-soft">
      <table className="min-w-full divide-y divide-white/5 text-left text-sm">
        <thead className="bg-slate-900/95 text-slate-400">
          <tr>
            <th className="px-4 py-4">Projeto</th>
            <th className="px-4 py-4">Responsável</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Prioridade</th>
            <th className="px-4 py-4">Término</th>
            <th className="px-4 py-4">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-slate-950/60">
          {projects.map((project) => (
            <tr key={project.id} className="transition hover:bg-slate-900/80">
              <td className="px-4 py-4">
                <div>
                  <p className="font-semibold text-white">{project.title}</p>
                  <p className="text-xs text-slate-400">Atualizado {new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-slate-300">{project.owner}</td>
              <td className="px-4 py-4"><StatusPill value={project.status} /></td>
              <td className="px-4 py-4 text-slate-300">{priorityLabels[project.priority as keyof typeof priorityLabels] ?? project.priority}</td>
              <td className="px-4 py-4 text-slate-300">{new Date(project.endDate).toLocaleDateString()}</td>
              <td className="px-4 py-4">
                <Link href={`/dashboard/projects/${project.id}`} className="rounded-2xl bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20">
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
