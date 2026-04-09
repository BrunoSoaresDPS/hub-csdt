import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET ?? 'change_this_secret';

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
