'use client';

import { useState } from 'react';
import Link from 'next/link';
import IvecoLogo from '../components/IvecoLogo';

export default function HomePage() {
  const [form, setForm] = useState({ title: '', description: '', owner: '' });
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    const response = await fetch('/api/projects/public', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus({ loading: false, message: data.error || 'Erro ao enviar projeto.', error: true });
      return;
    }

    setStatus({ loading: false, message: 'Projeto enviado com sucesso! Nossa equipe entrará em contato.', error: false });
    setForm({ title: '', description: '', owner: '' });
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Top bar */}
      <header className="border-b border-[#1a1a1e] bg-[#080808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <IvecoLogo size="md" showTagline />
          <Link
            href="/login"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-[#555562] transition-colors hover:text-white"
          >
            Acesso admin →
          </Link>
        </div>
      </header>

      <div className="h-[3px] bg-[#1654FF]" />

      <main className="flex-1 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_480px] lg:gap-16 lg:items-start">

            {/* Left: hero */}
            <div className="space-y-8 pt-2">
              <div className="space-y-2">
                <p className="iveco-label text-[#1654FF]">Portal de Projetos</p>
                <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Registre seu<br />
                  <span className="text-[#1654FF]">projeto</span>{' '}
                  aqui.
                </h1>
                <p className="mt-4 max-w-md text-base text-[#9999a8] leading-relaxed">
                  Qualquer pessoa pode submeter novos projetos. Nosso time administrativo receberá, avaliará e gerenciará cada solicitação no painel interno.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Rápido', desc: 'Formulário simples e direto' },
                  { label: 'Seguro', desc: 'Dados protegidos e criptografados' },
                  { label: 'Rastreável', desc: 'Acompanhe o status em tempo real' },
                ].map((item) => (
                  <div key={item.label} className="iveco-card iveco-border-l rounded-l-none p-4 animate-fade-in">
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="mt-1 text-xs text-[#555562]">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { value: '100%', label: 'Gratuito' },
                  { value: '< 2 min', label: 'Para preencher' },
                  { value: '24h', label: 'Resposta média' },
                ].map((s) => (
                  <div key={s.label} className="space-y-1">
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-xs text-[#555562] uppercase tracking-[0.1em]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="iveco-card animate-fade-in">
              <div className="border-b border-[#232329] px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="iveco-label text-[#1654FF]">Novo projeto</p>
                    <h2 className="mt-1 text-lg font-bold text-white">Formulário de submissão</h2>
                  </div>
                  <span className="rounded-full border border-[#232329] bg-[#17171b] px-3 py-1 text-xs font-medium text-[#9999a8]">
                    Público · Sem login
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className="iveco-label mb-1.5 block">Nome do projeto</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ex: Expansão de frota Sul"
                    className="iveco-input"
                  />
                </div>

                <div>
                  <label className="iveco-label mb-1.5 block">Descrição</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Objetivos, escopo, entregas esperadas..."
                    rows={5}
                    className="iveco-input resize-none"
                  />
                </div>

                <div>
                  <label className="iveco-label mb-1.5 block">Responsável</label>
                  <input
                    required
                    value={form.owner}
                    onChange={(e) => handleChange('owner', e.target.value)}
                    placeholder="Nome do responsável"
                    className="iveco-input"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="iveco-btn-primary w-full py-3 text-base"
                  >
                    {status.loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      'Enviar projeto'
                    )}
                  </button>

                  {status.message && (
                    <div className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
                      status.error
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    }`}>
                      {status.message}
                    </div>
                  )}
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>

      <footer className="border-t border-[#17171b] py-6 text-center">
        <p className="text-xs text-[#333340]">
          © {new Date().getFullYear()} IVECO Hub CSDT. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
