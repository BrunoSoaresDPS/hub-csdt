'use client';

import Topbar from '../../components/Topbar';
import OverviewShell from '../../components/OverviewShell';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="min-h-dvh">
      <Topbar title="Visão Geral" activeRoute="overview" />
      <main className="px-6 pb-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <OverviewShell />
        </div>
      </main>
    </div>
  );
}
