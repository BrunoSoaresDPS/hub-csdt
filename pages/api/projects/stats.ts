import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest, sendUnauthorized } from '../_helpers';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateRequest(req, res);
  if (!user) return sendUnauthorized(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      owner: true,
      status: true,
      priority: true,
      complexity: true,
      categories: true,
      impactFinancial: true,
      impactTime: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const byStatus: Record<string, number> = { REVIEW: 0, APPROVED: 0, IN_PROGRESS: 0, COMPLETED: 0 };
  const byPriority: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  const byComplexity: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  const byCategory: Record<string, number> = {};

  for (const p of projects) {
    if (p.status in byStatus) byStatus[p.status]++;
    if (p.priority in byPriority) byPriority[p.priority]++;
    if (p.complexity in byComplexity) byComplexity[p.complexity]++;

    try {
      const cats: string[] = JSON.parse(p.categories || '[]');
      for (const cat of cats) {
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      }
    } catch {}
  }

  const now = new Date();
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
    const count = projects.filter((p) => {
      const created = new Date(p.createdAt);
      return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth();
    }).length;
    monthlyTrend.push({ month: label, count });
  }

  return res.status(200).json({
    total: projects.length,
    byStatus,
    byPriority,
    byComplexity,
    byCategory,
    recentProjects: projects.slice(0, 5),
    monthlyTrend,
  });
}
