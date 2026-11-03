import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";
import { AuthenticatedRequest, JWTPayload, UserRole } from "../types";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthenticatedRequest;
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    authReq.user = decoded as JWTPayload;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      res.status(403).json({ success: false, message: "Acceso denegado: rol insuficiente" });
      return;
    }
    next();
  };
};
