'use client';

import { use } from 'react';
import Link from 'next/link';
import ProjectDetail from '../../../../components/ProjectDetail';
import Topbar from '../../../../components/Topbar';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default function ProjectPage({ params }: Props) {
  const { id } = use(params);

  return (
    <div className="min-h-dvh">
      <Topbar title="Detalhes do Projeto" activeRoute="detail" />
      <main className="px-6 pb-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-2 text-sm text-gray-400 dark:text-[#555562]">
            <Link href="/dashboard/projetos" className="transition-colors hover:text-gray-900 dark:hover:text-white">
              Projetos
            </Link>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-500 dark:text-[#9999a8]">Projeto</span>
          </nav>

          <ProjectDetail id={id} />
        </div>
      </main>
    </div>
  );
}
