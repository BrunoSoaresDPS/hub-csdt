import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookieParts = ['hub_token=; HttpOnly', 'Path=/', 'Max-Age=0', 'SameSite=Lax'];
  if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');
  res.setHeader('Set-Cookie', cookieParts.join('; '));
  res.status(200).json({ message: 'Logout realizado.' });
}
