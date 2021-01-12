import { Client } from "https://deno.land/x/postgres/mod.ts";

import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

const { DB_USER, DB_NAME, DB_HOST, DB_PASSWORD, DB_PORT } = config() 

export const client = new Client({
    user: DB_USER,
    database: DB_NAME,
    hostname: DB_HOST,
    password: DB_PASSWORD,
    port: +DB_PORT
  });