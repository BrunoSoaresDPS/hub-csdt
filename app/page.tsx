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
                  <p className="text-lg text-[#d4d4d8] leading-relaxed max-w-lg">
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
                      <p className="text-sm text-[#c4c4c8]">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Categories Preview */}
              <div className="space-y-4 animate-fade-in">
                <div>
                  <p className="iveco-label mb-4">Categorias de Projetos</p>
                  <p className="text-sm text-[#c4c4c8] mb-4">Selecione uma ou mais categorias que representam seu projeto:</p>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      icon: '💬',
                      name: 'Chatbot',
                      desc: 'Um assistente que responde automaticamente',
                      examples: 'Um robô que conversa com seus clientes 24 horas por dia, respondendo perguntas frequentes e ajudando sem precisar de uma pessoa do outro lado.',
                    },
                    {
                      icon: '🤖',
                      name: 'Ferramentas de IA',
                      desc: 'Máquinas inteligentes que aprendem',
                      examples: 'Um programa que consegue reconhecer rostos em fotos, entender o que você escreve ou prever qual produto um cliente vai querer comprar.',
                    },
                    {
                      icon: '📊',
                      name: 'Dashboards',
                      desc: 'Painel com suas informações em um olhar',
                      examples: 'Um gráfico bonito que mostra vendas, lucros, clientes novos e outras métricas importantes de forma visual e em tempo real.',
                    },
                    {
                      icon: '⚙️',
                      name: 'Automação',
                      desc: 'Tarefas que se fazem sozinhas',
                      examples: 'Um processo que funciona automaticamente: por exemplo, quando alguém compra, o sistema já envia o e-mail de confirmação e avisa o estoque sem ninguém fazer nada.',
                    },
                    {
                      icon: '🖥️',
                      name: 'Plataforma',
                      desc: 'Um software feito especialmente para você',
                      examples: 'Um site, um aplicativo de celular ou um sistema que resolve um problema específico do seu negócio do seu jeito, com suas cores e do seu jeito de funcionar.',
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
                          <p className="text-sm text-[#d4d4d8] mt-1">{cat.desc}</p>
                          <p className="text-xs text-[#a0a0a8] mt-2 leading-relaxed">{cat.examples}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-6 py-16 bg-[#17171b]/50 border-t border-[#232329]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <p className="iveco-label text-[#1654FF] mb-2">Como Funciona</p>
              <h2 className="text-3xl font-black text-white">Processo Simples e Intuitivo</h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Submeta',
                  description: 'Preencha o formulário inteligente com as informações do seu projeto',
                  icon: '📝',
                },
                {
                  step: '2',
                  title: 'Analisamos',
                  description: 'Nossa equipe avalia complexidade, viabilidade e prioridades',
                  icon: '🔍',
                },
                {
                  step: '3',
                  title: 'Executamos',
                  description: 'Transformamos em soluções reais dentro do prazo acordado',
                  icon: '✅',
                },
              ].map((item) => (
                <div key={item.step} className="iveco-card p-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#1654FF] group-hover:h-1 group-hover:w-full group-hover:top-0 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <p className="text-xs font-bold text-[#1654FF] mb-2">PASSO {item.step}</p>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-[#d4d4d8] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-lg text-[#d4d4d8] mb-8">
              Submeta seu projeto agora e veja como podemos transformar suas ideias em realidade.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1654FF] text-white font-bold rounded-lg hover:bg-[#0D3FCC] transition-all shadow-lg hover:shadow-[#1654FF]/40 hover:shadow-2xl group"
            >
              <span>Enviar Projeto</span>
              <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#232329] bg-[#080808] px-6 py-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm text-[#a0a0a8]">
              © {new Date().getFullYear()} IVECO Hub CSDT. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
