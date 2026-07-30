import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { sanitizeInput, validatePublicFormPayload, FIELD_LIMITS } from '../../../lib/validators';
import { assessComplexityForCategories, CATEGORY_CONFIG } from '../../../lib/formFlow';
import { computePriorityFromImpacts } from '../../../lib/workflow';
import { getClientIp, rateLimit } from '../../../lib/rate-limit';

const MAX_SUBMISSIONS = 10;
const WINDOW_MS = 10 * 60_000;

const ALLOWED_CATEGORIES = Object.keys(CATEGORY_CONFIG);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  if (!rateLimit(`public-form:${ip}`, MAX_SUBMISSIONS, WINDOW_MS)) {
    return res.status(429).json({ error: 'Muitos envios em sequência. Aguarde alguns minutos e tente novamente.' });
  }

  const { categories, title, description, owner, impactFinancial, impactTime, additionalAnswers } = req.body ?? {};

  // Validar payload
  const errors = validatePublicFormPayload(
    {
      categories,
      title,
      description,
      owner,
      impactFinancial,
      impactTime,
      additionalAnswers,
    },
    ALLOWED_CATEGORIES
  );

  if (errors.length) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  const admin = await prisma.user.findFirst();
  if (!admin) {
    return res.status(500).json({ error: 'Nenhum administrador configurado.' });
  }

  const today = new Date();
  const complexity = assessComplexityForCategories(categories);
  const priority = computePriorityFromImpacts(impactFinancial, impactTime);

  try {
    const project = await prisma.project.create({
      data: {
        title: sanitizeInput(title, FIELD_LIMITS.title),
        description: sanitizeInput(description, FIELD_LIMITS.description),
        owner: sanitizeInput(owner, FIELD_LIMITS.owner),
        categories: JSON.stringify(categories),
        impactFinancial: impactFinancial || undefined,
        impactTime: impactTime || undefined,
        additionalQuestions: additionalAnswers ? JSON.stringify(additionalAnswers) : undefined,
        status: 'REVIEW',
        priority,
        complexity,
        startDate: today,
        endDate: today,
        authorId: admin.id,
        changeLogs: {
          create: { message: 'Projeto criado através do formulário público.' },
        },
      },
    });

    // Retornar apenas o essencial: a resposta é pública e não deve expor
    // o registro completo (authorId, status interno, etc.).
    return res.status(201).json({ project: { id: project.id, title: project.title } });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Erro ao criar projeto.' });
  }
}
