import jwt from 'jsonwebtoken';

const envSecret = process.env.JWT_SECRET;

if (!envSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET precisa estar definido em produção.');
}

const secret = envSecret ?? 'dev_only_secret_do_not_use_in_production';

export function signToken(payload: object) {
  return jwt.sign(payload, secret, { expiresIn: '8h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}
