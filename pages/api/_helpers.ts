import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { verifyToken } from '../../lib/jwt';
import { prisma } from '../../lib/prisma';

export async function authenticateRequest(req: NextApiRequest, res: NextApiResponse) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  const token = cookies['hub_token'];
  if (!token) return null;

  const payload = verifyToken(token) as { sub: string } | null;
  if (!payload?.sub) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  return user;
}

export function sendUnauthorized(res: NextApiResponse) {
  res.status(401).json({ error: 'Não autorizado.' });
}
