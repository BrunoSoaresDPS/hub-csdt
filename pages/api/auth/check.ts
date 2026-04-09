import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateRequest } from '../_helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await authenticateRequest(req, res);
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }

  return res.status(200).json({ user });
}