import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";
import { AuthenticatedRequest, JWTPayload, UserRole } from "../types";
import { HTTP_STATUS } from "../utils/constants";
import { errorResponse } from "../utils/response";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthenticatedRequest;
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Token no proporcionado"));
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Token no proporcionado"));
    return;
  }

  try {
    const decoded = verifyAccessToken(token) as JWTPayload;
    authReq.user = decoded;
    next();
  } catch {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("Token inválido o expirado"));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      res
        .status(HTTP_STATUS.FORBIDDEN)
        .json(errorResponse("Acceso denegado: rol insuficiente"));
      return;
    }
    next();
  };
};
