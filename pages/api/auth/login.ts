import type { NextApiRequest, NextApiResponse } from 'next';
import { comparePassword, getUserByEmail } from '../../../lib/auth';
import { signToken } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const user = await getUserByEmail(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = signToken({ sub: user.id, email: user.email });
  const cookieParts = [`hub_token=${token}`, 'HttpOnly', 'Path=/', 'Max-Age=28800', 'SameSite=Lax'];
  if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');
  res.setHeader('Set-Cookie', cookieParts.join('; '));
  return res.status(200).json({ message: 'Login realizado com sucesso.' });
}
