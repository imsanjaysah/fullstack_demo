import { Request } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { client } from "../db/db.ts";
import { User } from "../types/types.ts";
import { queryByIdString } from "./queryStrings.ts";

export const isAuthenticated = async (request: Request) => {
  // Check if user-id is presented

  if (!request.userId) throw new Error("Please login to proceed.");

  // Query user from the database
  await client.connect();

  const result = await client.query(queryByIdString(request.userId));

  const user = result.rowsOfObjects()[0] as User;

  if (!user) throw new Error("Not authenticated");

  // Check if the token version is valid
  if (user.token_version !== request.tokenVersion)
    throw new Error("Not authenticated");

  return user;
};
