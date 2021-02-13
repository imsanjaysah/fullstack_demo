import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v6.2.0/router.ts";
import { client } from "../db/db.ts";
import { UserResponse, User, SignInArgs } from "../types/types.ts";
import { SignupArgs } from "../types/types.ts";
import { queryByEmailString, insertUserString } from "../utils/queryStrings.ts";
import { createToken, sendToken } from "../utils/tokenHandler.ts";

import {
  validateUsername,
  validatePassword,
  validateEmail,
} from "../utils/validations.ts";

export const Mutation = {
  signup: async (
    _: any,
    { username, email, password }: SignupArgs,
    { cookies }: RouterContext
  ): Promise<UserResponse | null> => {
    try {
      // Check if args obj is provided
      if (!username) throw new Error("Username is required.");
      if (!email) throw new Error("Email is required.");
      if (!password) throw new Error("Password is required.");

      // Validate username
      const formattedUsername = username.trim();
      const isUsernameValid = validateUsername(formattedUsername);

      if (!isUsernameValid) {
        throw new Error("Username must be between 3 to 200 characters.");
      }

      // Validate password
      const isValidPassword = validatePassword(password);

      if (!isValidPassword)
        throw new Error("Password must be between 6 to 30 characters.");

      const formattedEmail = email.trim().toLowerCase();
      const isValidEmail = validateEmail(formattedEmail);

      if (!isValidEmail) throw new Error("Email is invalid.");

      // Connect to database
      await client.connect();

      const result = await client.query(queryByEmailString(formattedEmail));
      const user = result.rowsOfObjects()[0] as User;

      if (user) throw new Error("This email is already in use.");

      // Hash the password
      const hashedPassword = await bcrypt.hash(password);

      // Save a new user to the database
      const userData = await client.query(
        insertUserString(formattedUsername, formattedEmail, hashedPassword)
      );
      const newUser = userData.rowsOfObjects()[0] as User;
      const returnedUser: UserResponse = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
        created_at: newUser.created_at,
      };

      await client.end();

      // Create a JWT token
      const token = await createToken(newUser.id, newUser.token_version);

      // Send the JWT token to frontend

      sendToken(cookies, token);

      return returnedUser;
    } catch (error) {
      throw error;
    }
  },

  signin: async (
    _: any,
    { email, password }: SignInArgs,
    { cookies }: RouterContext
  ): Promise<UserResponse | null> => {
    try {
      // Check if args obj is provided
      if (!email) throw new Error("Email is required.");
      if (!password) throw new Error("Password is required.");

      // Validate password
      const isValidPassword = validatePassword(password);

      if (!isValidPassword)
        throw new Error("Password must be between 6 to 30 characters.");

      const formattedEmail = email.trim().toLowerCase();

      // Connect to database
      await client.connect();

      const result = await client.query(queryByEmailString(formattedEmail));
      const user = result.rowsOfObjects()[0] as User;

      if (!user) throw new Error("Email is incorrect.");

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) throw new Error("Password is incorrect.");

      const returnedUser: UserResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        created_at: user.created_at,
      };

      await client.end();

      // Create a JWT token
      const token = await createToken(user.id, user.token_version);

      // Send the JWT token to frontend

      sendToken(cookies, token);

      return returnedUser;
    } catch (error) {
      throw error;
    }
  },
};

