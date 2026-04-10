import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { sanitizeInput, validatePublicFormPayload } from '../../../lib/validators';
import { assessComplexityForCategories } from '../../../lib/formFlow';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { categories, title, description, owner, impactFinancial, impactTime, additionalAnswers } = req.body;

  // Validar payload
  const errors = validatePublicFormPayload({
    categories,
    title,
    description,
    owner,
    impactFinancial,
    impactTime,
  });

  if (errors.length) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  const admin = await prisma.user.findFirst();
  if (!admin) {
    return res.status(500).json({ error: 'Nenhum administrador configurado.' });
  }

  const today = new Date();
  const complexity = assessComplexityForCategories(categories);

  try {
    const project = await prisma.project.create({
      data: {
        title: sanitizeInput(title),
        description: sanitizeInput(description),
        owner: sanitizeInput(owner),
        categories: JSON.stringify(categories),
        impactFinancial: impactFinancial || undefined,
        impactTime: impactTime || undefined,
        additionalQuestions: additionalAnswers ? JSON.stringify(additionalAnswers) : undefined,
        status: 'REVIEW',
        priority: 'MEDIUM',
        complexity,
        startDate: today,
        endDate: today,
        authorId: admin.id,
        changeLogs: {
          create: { message: 'Projeto criado através do formulário público.' },
        },
      },
    });

    return res.status(201).json({ project });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Erro ao criar projeto.' });
  }
}
