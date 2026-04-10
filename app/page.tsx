'use client';

import TypeformFlow from '../components/TypeformFlow';

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Simple header - hidden on small screens when in form */}
      <header className="border-b border-[#1a1a1e] bg-[#080808] hidden md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1654FF]">Portal de Projetos</p>
            <h1 className="text-lg font-bold text-white">IVECO Hub CSDT</h1>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <TypeformFlow />
      </main>
    </div>
  );
}
