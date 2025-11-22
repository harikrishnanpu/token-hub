# token-hub

A lightweight, TypeScript-first JWT authentication helper library for Express applications.  
It simplifies **access token generation**, **refresh token handling**, and **route protection** with clean APIs.

- ⚡ Simple access & refresh token creation  
- 🔐 Express auth middleware built inside `TokenService`  
- 🏗️ Optional refresh-token storage  
- 🛠️ Fully typed (TypeScript)  
- 📦 Designed for clean architecture  

---

## 🔧 Installation

```bash
npm install token-hub
or
yarn add token-hub


import { TokenService } from "token-hub";

const tokenService = new TokenService(
  process.env.ACCESS_SECRET!, 
  process.env.REFRESH_SECRET!,
  store: undefined, // optional);


const { accessToken, refreshToken } = await tokenService.generateTokens({userId: 'userid'});
const newTokens = await tokenService.refreshAccessToken(refreshToken);



If no store is provided, this still works, but:

⚠️ Security Warning:
You cannot revoke tokens, detect reuse attacks, or prevent replay attacks without a store.

For production systems, using a custom store is highly recommended.



app.get("/profile", tokenService.jwtAuth(), (req, res) => {
  res.json({
    message: "Protected route",
    user: (req as any).user,
  });
});


The middleware:

Validates the access token

Extracts req.user

Rejects unauthorized requests



🧩 Optional Refresh Token Store

Implement the RefreshTokenStore interface to enable:

Token revocation

Token rotation

Replay-attack protection




import { RefreshTokenStore } from "token-hub";

class MyStore implements RefreshTokenStore {
  private db = new Map<string, string>();

  async saveToken(token: string, userId: string) {
    this.db.set(token, userId);
  }

  async revokeToken(token: string) {
    this.db.delete(token);
  }

  async findToken(token: string) {
    const userId = this.db.get(token);
    return userId ? { userId } : null;
  }
}



const store = new MyStore();

const tokenService = new TokenService(
  accessSecret: process.env.ACCESS_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!,
  store,
);
