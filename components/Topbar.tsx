'use client';

import { useRouter } from 'next/navigation';

export default function Topbar({ title }: { title: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Painel CRM</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{title}</h1>
      </div>
      <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        Logout
      </button>
    </div>
  );
}
