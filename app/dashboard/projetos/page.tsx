'use client';

import Topbar from '../../../components/Topbar';
import DashboardShell from '../../../components/DashboardShell';

export const dynamic = 'force-dynamic';

export default function ProjetosPage() {
  return (
    <div className="min-h-dvh">
      <Topbar title="Projetos" activeRoute="projects" />
      <main className="px-6 pb-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <DashboardShell />
        </div>
      </main>
    </div>
  );
}
