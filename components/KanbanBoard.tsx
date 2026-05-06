'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
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

const COLUMNS = [
  { id: 'REVIEW', label: 'Em Revisão', color: 'border-amber-500', dot: 'bg-amber-400' },
  { id: 'APPROVED', label: 'Aprovado', color: 'border-emerald-500', dot: 'bg-emerald-400' },
  { id: 'IN_PROGRESS', label: 'Em Andamento', color: 'border-[#1654FF]', dot: 'bg-[#1654FF]' },
  { id: 'COMPLETED', label: 'Concluído', color: 'border-slate-500', dot: 'bg-slate-400' },
];

const priorityDot: Record<string, string> = {
  HIGH: 'bg-rose-400',
  MEDIUM: 'bg-amber-400',
  LOW: 'bg-slate-400',
};

function KanbanCard({ project, isDragOverlay = false }: { project: Project; isDragOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: project.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging && !isDragOverlay ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  let cats: string[] = [];
  try { cats = JSON.parse(project.categories || '[]'); } catch { /* ignore */ }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow dark:border-[#232329] dark:bg-[#17171b] ${
        isDragOverlay
          ? 'rotate-2 shadow-2xl'
          : 'cursor-grab hover:border-[#1654FF]/40 hover:shadow-md active:cursor-grabbing dark:hover:border-[#1654FF]/40'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">{project.title}</p>
        <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${priorityDot[project.priority] ?? 'bg-slate-400'}`} title={priorityLabels[project.priority as keyof typeof priorityLabels]} />
      </div>

      {cats.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {cats.slice(0, 2).map((cat) => (
            <span key={cat} className="inline-flex rounded-full border border-[#1654FF]/20 bg-[#1654FF]/10 px-2 py-0.5 text-[10px] font-medium text-[#1654FF] dark:text-[#7B9FFF]">
              {cat}
            </span>
          ))}
          {cats.length > 2 && (
            <span className="inline-flex rounded-full border border-[#1654FF]/20 bg-[#1654FF]/10 px-2 py-0.5 text-[10px] font-medium text-[#1654FF] dark:text-[#7B9FFF]">
              +{cats.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-[#555562]">{project.owner}</span>
        <Link
          href={`/dashboard/projects/${project.id}`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-500 transition-colors hover:border-[#1654FF]/40 hover:text-[#1654FF] dark:border-[#232329] dark:bg-[#0f0f11] dark:text-[#9999a8] dark:hover:text-[#7B9FFF]"
        >
          Detalhes
        </Link>
      </div>
    </div>
  );
}

function KanbanColumn({
  column,
  projects,
}: {
  column: (typeof COLUMNS)[number];
  projects: Project[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex min-w-0 flex-col">
      <div className={`mb-3 flex items-center gap-2 border-l-2 pl-3 ${column.color}`}>
        <div className={`h-2 w-2 rounded-full ${column.dot}`} />
        <span className="text-sm font-semibold text-gray-700 dark:text-[#d4d4d8]">{column.label}</span>
        <span className="ml-auto rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:border-[#232329] dark:bg-[#232329] dark:text-[#9999a8]">
          {projects.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[120px] flex-1 rounded-xl border-2 border-dashed p-2 transition-colors ${
          isOver
            ? 'border-[#1654FF]/60 bg-[#1654FF]/5'
            : 'border-gray-200 bg-gray-50/50 dark:border-[#232329]/60 dark:bg-[#0f0f11]/50'
        }`}
      >
        <div className="space-y-2">
          {projects.map((p) => (
            <KanbanCard key={p.id} project={p} />
          ))}
          {projects.length === 0 && (
            <div className="flex h-20 items-center justify-center">
              <p className="text-xs text-gray-400 dark:text-[#333340]">Sem projetos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard({ projects: initialProjects }: { projects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const projectsByColumn = COLUMNS.reduce<Record<string, Project[]>>((acc, col) => {
    acc[col.id] = projects.filter((p) => p.status === col.id);
    return acc;
  }, {});

  const handleDragStart = (event: DragStartEvent) => {
    const project = projects.find((p) => p.id === event.active.id);
    setActiveProject(project ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);
    if (!over) return;
    const newStatus = String(over.id);
    const project = projects.find((p) => p.id === active.id);
    if (!project || project.status === newStatus) return;
    if (!COLUMNS.find((c) => c.id === newStatus)) return;

    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p))
    );

    try {
      await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, status: project.status } : p))
      );
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => (
          <KanbanColumn key={col.id} column={col} projects={projectsByColumn[col.id]} />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease-out' }}>
        {activeProject ? <KanbanCard project={activeProject} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
