export type UserRole = "admin" | "profesor" | "estudiante";

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest {
  user?: JWTPayload;
}
