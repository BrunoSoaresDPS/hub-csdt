import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest, sendUnauthorized } from '../../../lib/api-helpers';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateRequest(req, res);
  if (!user) return sendUnauthorized(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  // Agregações feitas no banco (groupBy/count) em vez de carregar todos os
  // projetos em memória. Só a coluna `categories` (JSON string) e as datas da
  // janela de 6 meses precisam vir para o servidor.
  const [total, statusGroups, priorityGroups, complexityGroups, recentProjects, categoryRows, trendRows] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.project.groupBy({ by: ['priority'], _count: { _all: true } }),
      prisma.project.groupBy({ by: ['complexity'], _count: { _all: true } }),
      prisma.project.findMany({
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
        take: 5,
      }),
      prisma.project.findMany({ select: { categories: true } }),
      prisma.project.findMany({
        select: { createdAt: true },
        where: { createdAt: { gte: sixMonthsAgo } },
      }),
    ]);

  const byStatus: Record<string, number> = { REVIEW: 0, VALIDATION: 0, APPROVED: 0, IN_PROGRESS: 0, COMPLETED: 0, OUT_OF_SCOPE: 0 };
  for (const g of statusGroups) {
    byStatus[g.status] = g._count._all;
  }

  const byPriority: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  for (const g of priorityGroups) {
    byPriority[g.priority] = g._count._all;
  }

  const byComplexity: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  for (const g of complexityGroups) {
    byComplexity[g.complexity] = g._count._all;
  }

  const byCategory: Record<string, number> = {};
  for (const row of categoryRows) {
    try {
      const cats: string[] = JSON.parse(row.categories || '[]');
      for (const cat of cats) {
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      }
    } catch {}
  }

  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
    const count = trendRows.filter((p) => {
      const created = p.createdAt;
      return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth();
    }).length;
    monthlyTrend.push({ month: label, count });
  }

  // Resposta autenticada: cache apenas no navegador, nunca em CDN compartilhada.
  res.setHeader('Cache-Control', 'private, max-age=60');

  return res.status(200).json({
    total,
    byStatus,
    byPriority,
    byComplexity,
    byCategory,
    recentProjects,
    monthlyTrend,
  });
}
