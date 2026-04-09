'use client';

import { useRouter } from 'next/navigation';
import IvecoLogo from './IvecoLogo';

export default function Topbar({ title }: { title: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <header className="mb-8">
      {/* Blue brand line */}
      <div className="h-[3px] bg-[#1654FF]" />

      <div className="border-b border-[#1a1a1e] bg-[#0a0a0c]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <IvecoLogo size="sm" />
            <div className="hidden h-5 w-px bg-[#232329] sm:block" />
            <div className="hidden sm:block">
              <p className="iveco-label">Painel CRM</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[#232329] bg-[#17171b] px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-[#9999a8]">{title.replace('Olá, ', '')}</span>
            </div>
            <button
              onClick={handleLogout}
              className="iveco-btn-ghost py-2 text-xs"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
