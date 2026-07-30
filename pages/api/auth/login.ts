import type { NextApiRequest, NextApiResponse } from 'next';
import { comparePassword, getUserByEmail } from '../../../lib/auth';
import { signToken } from '../../../lib/jwt';
import { getClientIp, rateLimit } from '../../../lib/rate-limit';

// Hash de valor aleatório: usado quando o e-mail não existe, para que o tempo
// de resposta não revele quais e-mails estão cadastrados.
const DUMMY_HASH = '$2a$12$GifVKP9q6w96OSCIUKjn6ewR0ApF5CWS9NcDn0hQ6h1bXehWcMa9S';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  if (email.length > 254 || password.length > 128) {
    return res.status(400).json({ error: 'Credenciais inválidas.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const ip = getClientIp(req);
  if (!rateLimit(`login:${ip}`, MAX_ATTEMPTS, WINDOW_MS) || !rateLimit(`login:${normalizedEmail}`, MAX_ATTEMPTS, WINDOW_MS)) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde um minuto e tente novamente.' });
  }

  const user = await getUserByEmail(normalizedEmail);
  const isValid = await comparePassword(password, user?.password ?? DUMMY_HASH);
  if (!user || !isValid) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = signToken({ sub: user.id, email: user.email });
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieParts = [`hub_token=${token}`, 'HttpOnly', 'Path=/', 'Max-Age=28800', 'SameSite=Lax'];
  if (isProduction) {
    cookieParts.push('Secure');
  }
  res.setHeader('Set-Cookie', cookieParts.join('; '));
  return res.status(200).json({ message: 'Login realizado com sucesso.' });
}
