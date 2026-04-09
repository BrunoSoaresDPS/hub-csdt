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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-10 text-center text-slate-200">
            Carregando...
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Topbar title={`Olá, ${user.name}`} />
        <DashboardShell />
      </div>
    </main>
  );
}
