'use client';

import Link from 'next/link';
import TypeformFlow from '../components/TypeformFlow';

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header with admin access */}
      <header className="border-b border-[#1a1a1e] bg-[#080808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1654FF]">Portal de Projetos</p>
            <h1 className="text-lg font-bold text-white">IVECO Hub CSDT</h1>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1654FF] bg-[#1654FF]/10 text-sm font-semibold text-[#7B9FFF] transition-all hover:bg-[#1654FF]/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Acesso Admin
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <TypeformFlow />
      </main>
    </div>
  );
}
