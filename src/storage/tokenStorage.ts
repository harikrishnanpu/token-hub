export interface RefreshTokenStore {
  saveToken(token: string, userId: string): Promise<void>;
    findToken(token: string): Promise<{ userId: string } | null>;
    revokeToken(token: string):  Promise<void>;
}