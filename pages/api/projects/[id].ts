import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest, sendUnauthorized } from '../../../lib/api-helpers';
import { prisma } from '../../../lib/prisma';
import { sanitizeInput, validateProjectUpdatePayload, FIELD_LIMITS } from '../../../lib/validators';
import { canTransition, transitionErrorMessage } from '../../../lib/workflow';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateRequest(req, res);
  if (!user) return sendUnauthorized(res);

  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'ID inválido' });

  if (req.method === 'GET') {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { changeLogs: { orderBy: { createdAt: 'desc' } } },
    });
    if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });
    return res.status(200).json({ project });
  }

  if (req.method === 'PUT') {
    const data = req.body ?? {};
    const errors = validateProjectUpdatePayload(data);
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });

    if (data.status && !canTransition(project.status, data.status)) {
      return res.status(400).json({ error: transitionErrorMessage(project.status, data.status) });
    }

    await prisma.project.update({
      where: { id },
      data: {
        title: data.title ? sanitizeInput(data.title, FIELD_LIMITS.title) : project.title,
        description: data.description ? sanitizeInput(data.description, FIELD_LIMITS.description) : project.description,
        owner: data.owner ? sanitizeInput(data.owner, FIELD_LIMITS.owner) : project.owner,
        status: data.status || project.status,
        priority: data.priority || project.priority,
        startDate: data.startDate ? new Date(data.startDate) : project.startDate,
        endDate: data.endDate ? new Date(data.endDate) : project.endDate,
        changeLogs: {
          create: {
            message: sanitizeInput(data.changeLog, FIELD_LIMITS.changeLog) || 'Atualização de projeto realizada.',
          },
        },
      },
    });

    return res.status(200).json({ message: 'Projeto atualizado com sucesso.' });
  }

  if (req.method === 'DELETE') {
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem excluir projetos.' });
    }

    const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
    if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });

    await prisma.$transaction([
      prisma.changeLog.deleteMany({ where: { projectId: id } }),
      prisma.project.delete({ where: { id } }),
    ]);
    return res.status(200).json({ message: 'Projeto removido com sucesso.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
