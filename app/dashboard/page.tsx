import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserFromToken } from '../../lib/auth';
import Topbar from '../../components/Topbar';
import DashboardShell from '../../components/DashboardShell';

async function ensureAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('hub_token')?.value ?? null;
  const user = await getUserFromToken(token);
  return user;
}

export default async function DashboardPage() {
  const user = await ensureAuth();
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Topbar title={`Olá, ${user.name}`} />
        <DashboardShell />
      </div>
    </main>
  );
}
