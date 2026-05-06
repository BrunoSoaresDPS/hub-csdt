'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '../../components/Topbar';
import DashboardShell from '../../components/DashboardShell';
import OverviewShell from '../../components/OverviewShell';

interface User {
  id: string;
  name: string;
  email: string;
}

export const dynamic = 'force-dynamic';

type Tab = 'overview' | 'projects';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-6 w-6 animate-spin text-[#1654FF]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-gray-400 dark:text-[#555562]">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-dvh">
      <Topbar title={`Olá, ${user.name}`} />
      <main className="px-6 pb-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Tab navigation */}
          <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-[#232329]">
            <button
              onClick={() => setTab('overview')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === 'overview'
                  ? 'border-[#1654FF] text-[#1654FF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-[#555562] dark:hover:text-[#9999a8]'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Visão Geral
            </button>
            <button
              onClick={() => setTab('projects')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === 'projects'
                  ? 'border-[#1654FF] text-[#1654FF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-[#555562] dark:hover:text-[#9999a8]'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Projetos
            </button>
          </div>

          {tab === 'overview' && <OverviewShell />}
          {tab === 'projects' && <DashboardShell />}
        </div>
      </main>
    </div>
  );
}
