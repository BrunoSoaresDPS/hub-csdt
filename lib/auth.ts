import bcrypt from 'bcryptjs';
import { parse } from 'cookie';
import { verifyToken } from './jwt';
import { prisma } from './prisma';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserFromToken(token: string | null) {
  if (!token) return null;
  const payload = verifyToken(token) as { sub: string } | null;
  if (!payload?.sub) return null;
  return prisma.user.findUnique({ where: { id: payload.sub } });
}

export function parseCookieHeader(cookieHeader?: string) {
  if (!cookieHeader) return {};
  return parse(cookieHeader);
}
