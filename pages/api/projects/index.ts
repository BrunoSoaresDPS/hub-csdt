import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest, sendUnauthorized } from '../../../lib/api-helpers';
import { prisma } from '../../../lib/prisma';
import {
  validateProjectPayload,
  sanitizeInput,
  isValidStatus,
  isValidPriority,
  isValidComplexity,
  isValidImpactFinancial,
  isValidImpactTime,
  FIELD_LIMITS,
} from '../../../lib/validators';

const MAX_PAGE_SIZE = 100;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseDateParam(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  return isNaN(parsed) ? undefined : new Date(parsed);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateRequest(req, res);
  if (!user) return sendUnauthorized(res);

  if (req.method === 'GET') {
    const status = firstValue(req.query.status);
    const owner = firstValue(req.query.owner);
    const priority = firstValue(req.query.priority);
    const complexity = firstValue(req.query.complexity);
    const impactFinancial = firstValue(req.query.impactFinancial);
    const impactTime = firstValue(req.query.impactTime);
    const search = firstValue(req.query.search);
    const startDate = parseDateParam(firstValue(req.query.startDate));
    const endDate = parseDateParam(firstValue(req.query.endDate));

    const pageNumber = Math.max(Number(firstValue(req.query.page)) || 1, 1);
    const requestedSize = Number(firstValue(req.query.pageSize)) || 10;
    const take = Math.min(Math.max(requestedSize, 1), MAX_PAGE_SIZE);
    const skip = (pageNumber - 1) * take;

    // Filtros de enum só entram na query quando são valores válidos —
    // um valor arbitrário faria o Prisma lançar erro (500) em runtime.
    const filters: any = {};
    if (isValidStatus(status)) filters.status = status;
    if (isValidPriority(priority)) filters.priority = priority;
    if (isValidComplexity(complexity)) filters.complexity = complexity;
    if (isValidImpactFinancial(impactFinancial)) filters.impactFinancial = impactFinancial;
    if (isValidImpactTime(impactTime)) filters.impactTime = impactTime;
    if (owner) filters.owner = { contains: owner.slice(0, FIELD_LIMITS.owner), mode: 'insensitive' };
    if (search) {
      const term = search.slice(0, FIELD_LIMITS.title);
      filters.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ];
    }
    if (startDate || endDate) {
      filters.AND = [];
      if (startDate) filters.AND.push({ startDate: { gte: startDate } });
      if (endDate) filters.AND.push({ endDate: { lte: endDate } });
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
    const data = req.body ?? {};
    const errors = validateProjectPayload(data);
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    const project = await prisma.project.create({
      data: {
        title: sanitizeInput(data.title, FIELD_LIMITS.title),
        description: sanitizeInput(data.description, FIELD_LIMITS.description),
        owner: sanitizeInput(data.owner, FIELD_LIMITS.owner),
        categories: JSON.stringify(['Outros']),
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
