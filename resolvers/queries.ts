import { Context } from "https://deno.land/x/oak@v6.2.0/mod.ts";

import { client } from "../db/db.ts";
import { UserResponse } from "../types/types.ts";
import { isAuthenticated } from "../utils/authUtils.ts";

export const Query = {
  users: async () => {
    await client.connect();

    const result = await client.query("SELECT * FROM users;");

    const users = result.rowsOfObjects();

    return users;
  },

  // deno-lint-ignore no-explicit-any
  user: async (_: any, __: any, {request}: Context): Promise<UserResponse | null> => {
    try {
        const user = await isAuthenticated(request)

        const returnedUser: UserResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            created_at: user.created_at,
          };
          return returnedUser
    } catch (error) {
        throw error
    }
  },
};
