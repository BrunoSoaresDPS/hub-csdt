'use client';

import Link from 'next/link';
import { useState } from 'react';
import IvecoLogo from '../components/IvecoLogo';
import TypeformFlow from '../components/TypeformFlow';

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <div className="min-h-dvh flex flex-col">
        <header className="border-b border-[#1a1a1e] bg-[#080808]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 text-sm font-semibold text-[#7B9FFF] hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
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

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-[#080808] via-[#0f0f11] to-[#080808]">
      {/* Header */}
      <header className="border-b border-[#1a1a1e] bg-[#080808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <IvecoLogo size="md" showTagline />
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

      <div className="h-[3px] bg-gradient-to-r from-[#1654FF] via-[#1654FF] to-transparent" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left: Hero Content */}
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <p className="iveco-label text-[#1654FF]">Portal de Projetos</p>
                  <h1 className="text-4xl font-black leading-[1.2] tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Transforme suas ideias em <span className="text-[#1654FF]">projetos reais</span>
                  </h1>
                  <p className="text-lg text-[#e8e8ec] leading-relaxed max-w-lg">
                    Submeta seus projetos de forma simples e inteligente. Nossa equipe IVECO analisará, avaliará e transformará suas demandas em soluções concretas.
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#1654FF] text-white font-bold rounded-lg hover:bg-[#0D3FCC] transition-all shadow-lg hover:shadow-[#1654FF]/40 hover:shadow-2xl group"
                >
                  <span>Submeter Projeto</span>
                  <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                {/* Features */}
                <div className="grid gap-4 sm:grid-cols-3 pt-4">
                  {[
                    { icon: '⚡', label: 'Rápido', desc: '< 5 minutos' },
                    { icon: '🔒', label: 'Seguro', desc: 'Dados protegidos' },
                    { icon: '📊', label: 'Inteligente', desc: 'Auto-avaliação' },
                  ].map((feature) => (
                    <div key={feature.label} className="flex flex-col gap-2">
                      <span className="text-2xl">{feature.icon}</span>
                      <p className="font-semibold text-white">{feature.label}</p>
                      <p className="text-sm text-[#d8d8dc]">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Categories Preview */}
              <div className="space-y-4 animate-fade-in">
                <div>
                  <p className="iveco-label mb-4">Categorias de Projetos</p>
                  <p className="text-sm text-[#d8d8dc] mb-4">Selecione uma ou mais categorias que representam seu projeto:</p>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      icon: '💬',
                      name: 'Chatbot Corporativo',
                      desc: 'Atendimento interno ágil e inteligente',
                      examples: 'Um assistente digital que apoia colaboradores com dúvidas sobre processos, políticas, sistemas e solicitações internas, reduzindo demandas operacionais e aumentando a eficiência do time administrativo.',
                    },
                    {
                      icon: '🤖',
                      name: 'Ferramentas de IA',
                      desc: 'Inteligência para decisões estratégicas',
                      examples: 'Soluções que analisam dados financeiros, comerciais e operacionais, auxiliando na previsão de cenários, identificação de oportunidades e melhoria contínua dos processos administrativos.',
                    },
                    {
                      icon: '📊',
                      name: 'Dashboards Gerenciais',
                      desc: 'Visão estratégica em tempo real',
                      examples: 'Painéis que consolidam indicadores como faturamento, despesas, desempenho comercial e produtividade, permitindo acompanhamento rápido e decisões mais assertivas.',
                    },
                    {
                      icon: '⚙️',
                      name: 'Automação de Processos',
                      desc: 'Rotinas administrativas automatizadas',
                      examples: 'Automatização de tarefas como aprovação de documentos, fluxo de pagamentos, controle de contratos e gestão de solicitações internas, reduzindo retrabalho e aumentando a agilidade.',
                    },
                    {
                      icon: '💻',
                      name: 'Plataforma Corporativa',
                      desc: 'Gestão integrada e personalizada',
                      examples: 'Sistemas desenvolvidos para centralizar informações e integrar áreas como financeiro, RH, compras e comercial, garantindo maior controle, organização e eficiência operacional.',
                    },
                  ].map((cat) => (
                    <div
                      key={cat.name}
                      className="iveco-card p-4 hover:border-[#1654FF]/50 transition-all group cursor-pointer"
                    >
                      <div className="flex gap-3">
                        <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-white">{cat.name}</p>
                          <p className="text-sm text-[#e8e8ec] mt-1">{cat.desc}</p>
                          <p className="text-xs text-[#c8c8d0] mt-2 leading-relaxed">{cat.examples}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#232329] bg-[#080808] px-6 py-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm text-[#c8c8d0]">
              © {new Date().getFullYear()} IVECO Hub CSDT. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
