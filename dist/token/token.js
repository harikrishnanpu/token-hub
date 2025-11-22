import jwt from 'jsonwebtoken';
export function generateAccessToken(payload, secret) {
    return jwt.sign(payload, secret, { expiresIn: '15m' });
}
export function generateRefreshToken(payload, secret) {
    return jwt.sign(payload, secret, { expiresIn: '7d' });
}
export function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}
//# sourceMappingURL=token.js.map