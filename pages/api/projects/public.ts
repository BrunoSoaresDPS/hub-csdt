import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { sanitizeInput } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description, owner } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Título do projeto é obrigatório.' });
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'Descrição é obrigatória.' });
  }
  if (!owner || typeof owner !== 'string' || !owner.trim()) {
    return res.status(400).json({ error: 'Responsável é obrigatório.' });
  }

  const admin = await prisma.user.findFirst();
  if (!admin) {
    return res.status(500).json({ error: 'Nenhum administrador configurado.' });
  }

  const today = new Date();
  const project = await prisma.project.create({
    data: {
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      owner: sanitizeInput(owner),
      status: 'REVIEW',
      priority: 'MEDIUM',
      startDate: today,
      endDate: today,
      authorId: admin.id,
      changeLogs: {
        create: { message: 'Projeto criado através do formulário público.' },
      },
    },
  });

  return res.status(201).json({ project });
}
