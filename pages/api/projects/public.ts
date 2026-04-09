import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../lib/prisma';
import { validateProjectPayload, sanitizeInput } from '../../../lib/validators';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  ensureUploadDir();

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no upload de arquivo.' });
    }

    const projectData = {
      title: sanitizeInput(fields.title as string),
      description: sanitizeInput(fields.description as string),
      owner: sanitizeInput(fields.owner as string),
      startDate: fields.startDate as string,
      endDate: fields.endDate as string,
      status: sanitizeInput(fields.status as string),
      priority: sanitizeInput(fields.priority as string),
    };

    const errors = validateProjectPayload(projectData);
    if (errors.length) {
      return res.status(400).json({ error: errors.join(' ') });
    }

    const file = files.file as formidable.File | undefined;
    const fileUrl = file ? `/uploads/${path.basename(file.filepath)}` : null;

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
        fileUrl,
        authorId: admin.id,
        changeLogs: {
          create: {
            message: 'Projeto criado através do formulário público.',
          },
        },
      },
    });

    return res.status(201).json({ project });
  });
}
