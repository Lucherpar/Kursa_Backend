import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Response } from "express";

const mocks = vi.hoisted(() => ({
  register: vi.fn(),
  login: vi.fn(),
  refresh: vi.fn(),
  getUserById: vi.fn(),
}));

vi.mock("../services/auth.service", () => ({
  authService: {
    register: mocks.register,
    login: mocks.login,
    refresh: mocks.refresh,
    getUserById: mocks.getUserById,
  },
}));

import { authController } from "./auth.controller";
import type { AuthenticatedRequest } from "../types";

const createResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);
  return response as unknown as Response & typeof response;
};

const createRequest = (overrides: Partial<AuthenticatedRequest> = {}) =>
  ({ body: {}, ...overrides }) as AuthenticatedRequest;

const publicUser = {
  id: 1,
  email: "lucas@kursa.dev",
  role: "estudiante" as const,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("authController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("register responde 201 con el usuario creado", async () => {
    mocks.register.mockResolvedValue(publicUser);
    const req = createRequest({
      body: { email: "lucas@kursa.dev", password: "123456", role: "estudiante" },
    });
    const res = createResponse();

    await authController.register(req, res);

    expect(mocks.register).toHaveBeenCalledWith("lucas@kursa.dev", "123456", "estudiante");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Usuario registrado",
      data: publicUser,
    });
  });

  it("login responde 200 con tokens y usuario", async () => {
    const loginResult = {
      user: publicUser,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };
    mocks.login.mockResolvedValue(loginResult);
    const req = createRequest({ body: { email: "lucas@kursa.dev", password: "123456" } });
    const res = createResponse();

    await authController.login(req, res);

    expect(mocks.login).toHaveBeenCalledWith("lucas@kursa.dev", "123456");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Inicio de sesión exitoso",
      data: loginResult,
    });
  });

  it("refresh reenvía el refresh token al servicio", async () => {
    mocks.refresh.mockResolvedValue({ accessToken: "nuevo-access-token" });
    const req = createRequest({ body: { refreshToken: "refresh-token" } });
    const res = createResponse();

    await authController.refresh(req, res);

    expect(mocks.refresh).toHaveBeenCalledWith("refresh-token");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Token renovado",
      data: { accessToken: "nuevo-access-token" },
    });
  });

  it("me exige usuario autenticado", async () => {
    const req = createRequest();
    const res = createResponse();

    await expect(authController.me(req, res)).rejects.toMatchObject({
      name: "AppError",
      statusCode: 401,
    });
  });

  it("me responde 401 si el usuario del token ya no existe", async () => {
    mocks.getUserById.mockResolvedValue(null);
    const req = createRequest({ user: { userId: 99, email: "x@kursa.dev", role: "estudiante" } });
    const res = createResponse();

    await expect(authController.me(req, res)).rejects.toMatchObject({
      name: "AppError",
      statusCode: 401,
    });
  });

  it("me devuelve los datos del usuario autenticado", async () => {
    mocks.getUserById.mockResolvedValue(publicUser);
    const req = createRequest({ user: { userId: 1, email: "lucas@kursa.dev", role: "estudiante" } });
    const res = createResponse();

    await authController.me(req, res);

    expect(mocks.getUserById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: undefined,
      data: publicUser,
    });
  });

  it("logout responde con éxito", async () => {
    const req = createRequest();
    const res = createResponse();

    await authController.logout(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Sesión cerrada",
      data: null,
    });
  });

  it("propaga los errores del servicio al middleware de errores", async () => {
    const error = new Error("fallo inesperado");
    mocks.login.mockRejectedValue(error);
    const req = createRequest({ body: { email: "lucas@kursa.dev", password: "123456" } });
    const res = createResponse();

    await expect(authController.login(req, res)).rejects.toBe(error);
  });
});
