'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectDetail from '../../../../components/ProjectDetail';

interface Props {
  params: { id: string };
}

export default function ProjectPage({ params }: Props) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
        });
        if (response.ok) {
          setAuthenticated(true);
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
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-10 text-center text-slate-200">
            Carregando...
          </div>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-soft">
          <h1 className="text-3xl font-semibold text-white">Detalhes do projeto</h1>
          <p className="mt-2 text-slate-400">Revise, atualize o status ou exclua o projeto.</p>
        </div>
        <ProjectDetail id={params.id} />
      </div>
    </main>
  );
}
