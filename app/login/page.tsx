'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IvecoLogo from '../../components/IvecoLogo';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus({ loading: false, message: data.error || 'Credenciais inválidas.', error: true });
      return;
    }

    setStatus({ loading: false, message: 'Bem-vindo! Redirecionando...', error: false });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Blue top line */}
      <div className="h-[3px] bg-[#1654FF]" />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Logo */}
          <div className="mb-10 text-center">
            <div className="mb-3 flex justify-center">
              <IvecoLogo size="lg" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#555562]">
              Hub CSDT · Área Administrativa
            </p>
          </div>

          {/* Card */}
          <div className="iveco-card overflow-hidden">
            <div className="border-b border-[#232329] px-6 py-5">
              <h1 className="text-lg font-bold text-white">Acesso ao painel</h1>
              <p className="mt-1 text-sm text-[#555562]">
                Entre com suas credenciais para gerenciar os projetos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="iveco-label mb-1.5 block">E-mail</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@hubcsdt.com"
                  className="iveco-input"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="iveco-label mb-1.5 block">Senha</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="iveco-input"
                  autoComplete="current-password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status.loading}
                  className="iveco-btn-primary w-full py-3"
                >
                  {status.loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Entrando...
                    </span>
                  ) : (
                    'Entrar no painel'
                  )}
                </button>

                {status.message && (
                  <div
                    className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
                      status.error
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    }`}
                  >
                    {status.message}
                  </div>
                )}
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-[#333340]">
            © {new Date().getFullYear()} IVECO Hub CSDT
          </p>
        </div>
      </div>
    </div>
  );
}
