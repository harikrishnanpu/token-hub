import {  Request, Response, NextFunction } from "express";
import { RefreshTokenStore } from "../storage/tokenStorage.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../token/token.js";
import { generatedTokens } from "../types/generatedTokens.js";
import { TokenPayload } from "../types/tokenPayload.js";



export class TokenHubService {

    constructor(
        private accessTokenSecret: string,
        private refreshTokenSecret: string,
        private store?: RefreshTokenStore
    ) { }
    
    async generateTokens(payload: TokenPayload): Promise<generatedTokens> {
        const accessToken = generateAccessToken(payload, this.accessTokenSecret);
        const refreshToken = generateRefreshToken(payload, this.refreshTokenSecret);
        if (this.store) {   
            await this.store.saveToken(refreshToken, payload.userId);
        }
        return { accessToken, refreshToken };
    }


    async refreshToken(refreshToken: string): Promise<generatedTokens> {
        const payload = verifyToken(refreshToken, this.refreshTokenSecret) as TokenPayload;
        if (!payload || !payload.userId) {
            throw new Error('invalid refresh token')
        }
        if (this.store) {
            const record = await this.store.findToken(refreshToken);
            if (!record) {
                throw new Error('invalid refresh token. token not found in db')
            }
            await this.store.revokeToken(refreshToken);
        }

        const newAccessToken = generateAccessToken(payload, this.accessTokenSecret);
        const newRefreshToken = generateAccessToken(payload, this.refreshTokenSecret);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken }
    }

    jwtAuth(req: Request, res: Response, next: NextFunction) {
        try {
        
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // splitting Bearer
            if (!token) return res.sendStatus(401);

            const payload = verifyToken(token, this.accessTokenSecret);
            (req as any).user = payload;
            next();
            
        } catch (err) {
            return res.sendStatus(403);
        }
}

}