import { sign, verify, Secret, SignOptions } from "jsonwebtoken";
import { env } from "./env";
import type { JWTPayload, RefreshTokenPayload } from "../types";

export const signAccessToken = (payload: JWTPayload): string => {
  return sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return sign(payload, env.REFRESH_TOKEN_SECRET as Secret, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return verify(token, env.JWT_SECRET as Secret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return verify(token, env.REFRESH_TOKEN_SECRET as Secret) as RefreshTokenPayload;
};
