import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { signAccessToken, verifyRefreshToken } from "../config/jwt";
import { registerSchema, loginSchema } from "../types/schemas";
import { successResponse, errorResponse } from "../utils/response";
import { HTTP_STATUS } from "../utils/constants";
import { AuthenticatedRequest, JWTPayload } from "../types";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = registerSchema.parse(req.body);
      const user = await authService.register(data.email, data.password, data.role);
      res.status(HTTP_STATUS.CREATED).json(successResponse(user, "Usuario registrado"));
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data.email, data.password);
      res.json(successResponse(result, "Inicio de sesión exitoso"));
    } catch (error: any) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(error.message));
    }
  },

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse("Refresh token requerido"));
        return;
      }
      const decoded = verifyRefreshToken(refreshToken) as JWTPayload;
      const accessToken = signAccessToken({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      });
      res.json(successResponse({ accessToken }));
    } catch (error: any) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(error.message));
    }
  },

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse("No autenticado"));
        return;
      }
      const user = await authService.getUserById(req.user.userId);
      res.json(successResponse(user));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },
};
