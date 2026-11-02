import { sign, verify, Secret } from "jsonwebtoken";
import { env } from "./env";

export const signAccessToken = (payload: object): string => {
  return sign(payload, env.JWT_SECRET as Secret, { expiresIn: env.JWT_EXPIRES_IN });
};

export const signRefreshToken = (payload: object): string => {
  return sign(payload, env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN });
};

export const verifyAccessToken = (token: string): any => {
  return verify(token, env.JWT_SECRET as Secret);
};

export const verifyRefreshToken = (token: string): any => {
  return verify(token, env.REFRESH_TOKEN_SECRET as Secret);
};
