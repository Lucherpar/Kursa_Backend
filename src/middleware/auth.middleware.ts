import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";
import { USER_ROLES } from "../utils/constants";
import { AuthenticatedRequest } from "../types";

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(USER_ROLES.ADMIN === "admin" ? 401 : 401).json({ success: false, message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded as JWTPayload;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Acceso denegado: rol insuficiente" });
      return;
    }
    next();
  };
};
