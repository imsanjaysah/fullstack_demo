import { Middleware } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

import { verifyToken } from "../utils/tokenHandler.ts";
import { DecodedToken } from "../types/types.ts";

const { TOKEN_NAME } = config();

export const checkToken: Middleware = async (ctx, next) => {
  const token = ctx.cookies.get(TOKEN_NAME);

  if (token) { 
    // Verify token
    const decodedToken = (await verifyToken(token)) as DecodedToken | null;

    if (decodedToken) {
      const { payloadInfo, exp } = decodedToken;

      ctx.request.userId = payloadInfo.id;
      ctx.request.tokenVersion = payloadInfo.token_number;
      ctx.request.exp = exp;
    }
  }

  await next();
};
