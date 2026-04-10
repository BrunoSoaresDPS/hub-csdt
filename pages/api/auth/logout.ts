import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieParts = ['hub_token=; HttpOnly', 'Path=/', 'Max-Age=0'];
  if (isProduction) {
    cookieParts.push('Secure', 'SameSite=None');
  } else {
    cookieParts.push('SameSite=Lax');
  }
  res.setHeader('Set-Cookie', cookieParts.join('; '));
  res.status(200).json({ message: 'Logout realizado.' });
}
