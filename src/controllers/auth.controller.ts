import { Response } from "express";
import { authService } from "../services/auth.service";
import { LoginInput, RefreshTokenInput, RegisterInput } from "../types/schemas";
import { successResponse } from "../utils/response";
import { HTTP_STATUS } from "../utils/constants";
import { AppError } from "../utils/errors";
import { AuthenticatedRequest } from "../types";

export const authController = {
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    const data = req.body as RegisterInput;
    const user = await authService.register(data.email, data.password, data.role);
    res.status(HTTP_STATUS.CREATED).json(successResponse(user, "Usuario registrado"));
  },

  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    const data = req.body as LoginInput;
    const result = await authService.login(data.email, data.password);
    res.json(successResponse(result, "Inicio de sesión exitoso"));
  },

  async refresh(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body as RefreshTokenInput;
    const result = await authService.refresh(refreshToken);
    res.json(successResponse(result, "Token renovado"));
  },

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError("No autenticado", HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await authService.getUserById(req.user.userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", HTTP_STATUS.UNAUTHORIZED);
    }

    res.json(successResponse(user));
  },

  async logout(_req: AuthenticatedRequest, res: Response): Promise<void> {
    // Los JWT son stateless: el cliente debe descartar access y refresh token.
    res.json(successResponse(null, "Sesión cerrada"));
  },
};
