'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-950/80 p-10 shadow-soft">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Área administrativa</p>
          <h1 className="text-4xl font-semibold text-white">Acesse o painel</h1>
          <p className="text-slate-400">Entre com suas credenciais para gerenciar os projetos cadastrados.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@hubcsdt.com" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none focus:border-cyan-400" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Senha</span>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="********" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none focus:border-cyan-400" />
          </label>
          <button type="submit" disabled={status.loading} className="w-full rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
            {status.loading ? 'Entrando...' : 'Entrar no painel'}
          </button>
          {status.message ? <p className={`text-sm ${status.error ? 'text-rose-300' : 'text-emerald-300'}`}>{status.message}</p> : null}
        </form>
      </div>
    </main>
  );
}
