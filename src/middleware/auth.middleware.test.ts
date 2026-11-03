import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";

const mocks = vi.hoisted(() => ({
  verifyAccessToken: vi.fn(),
}));

vi.mock("../config/jwt", () => ({
  verifyAccessToken: mocks.verifyAccessToken,
}));

import { authenticate, authorize } from "./auth.middleware";

const createResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);
  return response as unknown as Response & typeof response;
};

describe("auth.middleware", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("authenticate", () => {
    it("rechaza peticiones sin cabecera Bearer", () => {
      const req = { headers: {} } as Request;
      const res = createResponse();
      const next = vi.fn() as NextFunction;

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Token no proporcionado",
        error: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("rechaza una cabecera Bearer vacía", () => {
      const req = { headers: { authorization: "Bearer   " } } as unknown as Request;
      const res = createResponse();
      const next = vi.fn() as NextFunction;

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("rechaza tokens inválidos o expirados", () => {
      mocks.verifyAccessToken.mockImplementation(() => {
        throw new Error("expired");
      });
      const req = { headers: { authorization: "Bearer token-invalido" } } as Request;
      const res = createResponse();
      const next = vi.fn() as NextFunction;

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Token inválido o expirado",
        error: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("adjunta el payload a req.user y continúa", () => {
      const payload = { userId: 1, email: "lucas@kursa.dev", role: "estudiante" };
      mocks.verifyAccessToken.mockReturnValue(payload);
      const req = { headers: { authorization: "Bearer token-valido" } } as unknown as Request & {
        user?: unknown;
      };
      const res = createResponse();
      const next = vi.fn() as NextFunction;

      authenticate(req, res, next);

      expect(req.user).toEqual(payload);
      expect(next).toHaveBeenCalledOnce();
    });
  });

  describe("authorize", () => {
    it("rechaza peticiones sin usuario autenticado", () => {
      const req = {} as Request;
      const res = createResponse();
      const next = vi.fn() as NextFunction;

      authorize("admin")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("rechaza roles no autorizados", () => {
      const req = { user: { role: "estudiante" } } as unknown as Request;
      const res = createResponse();
      const next = vi.fn() as NextFunction;

      authorize("admin", "profesor")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("permite continuar si el rol está autorizado", () => {
      const req = { user: { role: "profesor" } } as unknown as Request;
      const res = createResponse();
      const next = vi.fn() as NextFunction;

      authorize("admin", "profesor")(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
