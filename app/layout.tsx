import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hub CSDT | CRM de Projetos',
  description: 'Plataforma de gestão de projetos estilo CRM com cadastro público e painel administrativo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
