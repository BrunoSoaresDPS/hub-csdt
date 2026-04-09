import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest, sendUnauthorized } from '../_helpers';
import { prisma } from '../../../lib/prisma';
import { sanitizeInput } from '../../../lib/validators';

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
    const data = req.body;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });

    await prisma.project.update({
      where: { id },
      data: {
        title: sanitizeInput(data.title || project.title),
        description: sanitizeInput(data.description || project.description),
        owner: sanitizeInput(data.owner || project.owner),
        status: data.status || project.status,
        priority: data.priority || project.priority,
        startDate: data.startDate ? new Date(data.startDate) : project.startDate,
        endDate: data.endDate ? new Date(data.endDate) : project.endDate,
        changeLogs: {
          create: {
            message: sanitizeInput(data.changeLog || 'Atualização de projeto realizada.'),
          },
        },
      },
    });

    return res.status(200).json({ message: 'Projeto atualizado com sucesso.' });
  }

  if (req.method === 'DELETE') {
    await prisma.project.delete({ where: { id } });
    return res.status(200).json({ message: 'Projeto removido com sucesso.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
