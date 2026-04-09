'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProjectDetail from '../../../../components/ProjectDetail';
import Topbar from '../../../../components/Topbar';

interface Props {
  params: { id: string };
}

export const dynamic = 'force-dynamic';

export default function ProjectPage({ params }: Props) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check', { credentials: 'include' });
        if (response.ok) {
          setAuthenticated(true);
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
        <svg className="h-6 w-6 animate-spin text-[#1654FF]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-dvh">
      <Topbar title="Detalhes do Projeto" />
      <main className="px-6 pb-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-2 text-sm text-[#555562]">
            <Link href="/dashboard" className="transition-colors hover:text-white">
              Painel
            </Link>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#9999a8]">Projeto</span>
          </nav>

          <ProjectDetail id={params.id} />
        </div>
      </main>
    </div>
  );
}
