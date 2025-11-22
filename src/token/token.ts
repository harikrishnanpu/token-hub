import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/tokenPayload.js';



export function generateAccessToken(payload: TokenPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: '15m' });
}


export function generateRefreshToken(payload: TokenPayload, secret: string): string {
    return jwt.sign(payload, secret, { expiresIn: '7d' });
}


export function verifyToken(token: string, secret: string): TokenPayload {
  return jwt.verify(token, secret) as TokenPayload;
}