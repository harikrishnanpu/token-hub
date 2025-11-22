import { generateAccessToken, generateRefreshToken, verifyToken } from "../token/token.js";
export class TokenHubService {
    accessTokenSecret;
    refreshTokenSecret;
    store;
    constructor(accessTokenSecret, refreshTokenSecret, store) {
        this.accessTokenSecret = accessTokenSecret;
        this.refreshTokenSecret = refreshTokenSecret;
        this.store = store;
    }
    async generateTokens(payload) {
        const accessToken = generateAccessToken(payload, this.accessTokenSecret);
        const refreshToken = generateRefreshToken(payload, this.refreshTokenSecret);
        if (this.store) {
            await this.store.saveToken(refreshToken, payload.userId);
        }
        return { accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        const payload = verifyToken(refreshToken, this.refreshTokenSecret);
        if (!payload || !payload.userId) {
            throw new Error('invalid refresh token');
        }
        if (this.store) {
            const record = await this.store.findToken(refreshToken);
            if (!record) {
                throw new Error('invalid refresh token. token not found in db');
            }
            await this.store.revokeToken(refreshToken);
        }
        const newAccessToken = generateAccessToken(payload, this.accessTokenSecret);
        const newRefreshToken = generateAccessToken(payload, this.refreshTokenSecret);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    jwtAuth(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // splitting Bearer
            if (!token)
                return res.sendStatus(401);
            const payload = verifyToken(token, this.accessTokenSecret);
            req.user = payload;
            next();
        }
        catch (err) {
            return res.sendStatus(403);
        }
    }
}
//# sourceMappingURL=tokenService.js.map