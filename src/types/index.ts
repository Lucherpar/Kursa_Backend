import type { Request } from "express";

export type UserRole = "admin" | "profesor" | "estudiante";

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
