import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest, sendUnauthorized } from '../_helpers';
import { prisma } from '../../../lib/prisma';
import { validateProjectPayload, sanitizeInput } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateRequest(req, res);
  if (!user) return sendUnauthorized(res);

  if (req.method === 'GET') {
    const { status, owner, priority, complexity, search, startDate, endDate, page = '1', pageSize = '10' } = req.query;
    const pageNumber = Math.max(Number(page), 1);
    const take = Math.max(Number(pageSize), 10);
    const skip = (pageNumber - 1) * take;

    const filters: any = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (complexity) filters.complexity = complexity;
    if (owner) filters.owner = { contains: String(owner), mode: 'insensitive' };
    if (search) {
      filters.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (startDate || endDate) {
      filters.AND = [];
      if (startDate) filters.AND.push({ startDate: { gte: new Date(String(startDate)) } });
      if (endDate) filters.AND.push({ endDate: { lte: new Date(String(endDate)) } });
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: filters,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.project.count({ where: filters }),
    ]);

    return res.status(200).json({ projects, total, page: pageNumber, pageSize: take });
  }

  if (req.method === 'POST') {
    const data = req.body;
    const errors = validateProjectPayload(data);
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    const project = await prisma.project.create({
      data: {
        title: sanitizeInput(data.title),
        description: sanitizeInput(data.description),
        owner: sanitizeInput(data.owner),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status,
        priority: data.priority,
        authorId: user.id,
        changeLogs: {
          create: {
            message: 'Projeto criado pelo usuário autenticado.',
          },
        },
      },
    });
    return res.status(201).json({ project });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
