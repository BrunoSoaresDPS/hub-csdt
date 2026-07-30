import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { verifyToken } from './jwt';
import { prisma } from './prisma';

// Nunca incluir `password` aqui: o resultado deste select transita por
// handlers que serializam o usuário na resposta HTTP.
const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export async function authenticateRequest(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<SafeUser | null> {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  const token = cookies['hub_token'];
  if (!token) return null;

  const payload = verifyToken(token) as { sub: string } | null;
  if (!payload?.sub) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: SAFE_USER_SELECT,
  });
  return user;
}

export function sendUnauthorized(res: NextApiResponse) {
  res.status(401).json({ error: 'Não autorizado.' });
}
