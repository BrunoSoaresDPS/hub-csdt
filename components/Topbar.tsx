'use client';

import Link from 'next/link';
import IvecoLogo from './IvecoLogo';
import ThemeToggle from './ThemeToggle';

type ActiveRoute = 'overview' | 'projects' | 'detail' | undefined;

interface TopbarProps {
  title: string;
  activeRoute?: ActiveRoute;
}

const navLinks = [
  { label: 'Visão Geral', href: '/dashboard', route: 'overview' as ActiveRoute },
  { label: 'Projetos',    href: '/dashboard/projetos', route: 'projects' as ActiveRoute },
];

export default function Topbar({ title, activeRoute }: TopbarProps) {
  return (
    <header className="mb-8">
      <div className="h-[3px] bg-[#1654FF]" />

      <div className="border-b border-gray-200 bg-white dark:border-[#1a1a1e] dark:bg-[#0a0a0c]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <IvecoLogo size="sm" />
            <div className="hidden h-5 w-px bg-gray-200 dark:bg-[#232329] sm:block" />
            <div className="hidden sm:block">
              <p className="iveco-label">Painel CRM</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="iveco-btn-ghost py-2 text-xs">
              Formulário público
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 px-6">
          {navLinks.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1654FF] dark:text-white'
                    : 'text-gray-400 hover:text-gray-700 dark:text-[#555562] dark:hover:text-[#9999a8]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
