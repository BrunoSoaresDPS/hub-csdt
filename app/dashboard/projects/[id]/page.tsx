import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserFromToken } from '../../../../lib/auth';
import ProjectDetail from '../../../../components/ProjectDetail';

async function ensureAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('hub_token')?.value ?? null;
  const user = await getUserFromToken(token);
  return user;
}

interface Props {
  params: { id: string };
}

export default async function ProjectPage({ params }: Props) {
  const user = await ensureAuth();
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-soft">
          <h1 className="text-3xl font-semibold text-white">Detalhes do projeto</h1>
          <p className="mt-2 text-slate-400">Revise, atualize o status ou exclua o projeto.</p>
        </div>
        <ProjectDetail id={params.id} />
      </div>
    </main>
  );
}
