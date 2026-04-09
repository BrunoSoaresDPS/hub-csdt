'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '../../components/Topbar';
import DashboardShell from '../../components/DashboardShell';

interface User {
  id: string;
  name: string;
  email: string;
}

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
          <p className="text-sm text-[#555562]">Verificando acesso...</p>
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
          <DashboardShell />
        </div>
      </main>
    </div>
  );
}
