import {
  Header,
  create,
  verify,
  Payload,
  getNumericDate,
} from "https://deno.land/x/djwt@v2.2/mod.ts";
import { Cookies } from "https://deno.land/x/oak@v6.2.0/cookies.ts";
import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";
import { PayloadInfo } from "../types/types.ts";
const { TOKEN_SECRET, TOKEN_NAME } = config()

const header: Header = {
  alg: "HS512",
  typ: "JWT",
};

export const createToken = async (id: string, token_number: number) => {
  const payloadInfo: PayloadInfo = {
    id,
    token_number,
  };
  const payload: Payload = {
    payloadInfo,
    exp: getNumericDate(1000 * 60 * 60 * 24),
  };
  return await create(header, payload, TOKEN_SECRET);
};

export const sendToken = (cookies: Cookies, token: string) =>
  cookies.set(TOKEN_NAME, token, { httpOnly: true });


export const verifyToken = async (token: string) => await verify(token, TOKEN_SECRET, header.alg)
