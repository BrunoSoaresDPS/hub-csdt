import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { validateProjectPayload, sanitizeInput } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  const projectData = {
    title: sanitizeInput(data.title),
    description: sanitizeInput(data.description),
    owner: sanitizeInput(data.owner),
    startDate: data.startDate as string,
    endDate: data.endDate as string,
    status: sanitizeInput(data.status),
    priority: sanitizeInput(data.priority),
  };

  const errors = validateProjectPayload(projectData);
  if (errors.length) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  const admin = await prisma.user.findFirst();
  if (!admin) {
    return res.status(500).json({ error: 'Nenhum administrador configurado. Execute o seed.' });
  }

  const project = await prisma.project.create({
    data: {
      title: projectData.title,
      description: projectData.description,
      owner: projectData.owner,
      startDate: new Date(projectData.startDate),
      endDate: new Date(projectData.endDate),
      status: projectData.status as any,
      priority: projectData.priority as any,
      authorId: admin.id,
      changeLogs: {
        create: {
          message: 'Projeto criado através do formulário público.',
        },
      },
    },
  });

  return res.status(201).json({ project });
}
