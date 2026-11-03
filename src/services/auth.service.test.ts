import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  selectWhere: vi.fn(),
  insertValues: vi.fn(),
  insertReturning: vi.fn(),
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
  hash: vi.fn(),
  compare: vi.fn(),
}));

vi.mock("../config/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: mocks.selectWhere,
      }),
    }),
    insert: () => ({
      values: mocks.insertValues,
    }),
  },
}));

vi.mock("../config/jwt", () => ({
  signAccessToken: mocks.signAccessToken,
  signRefreshToken: mocks.signRefreshToken,
  verifyRefreshToken: mocks.verifyRefreshToken,
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: mocks.hash,
    compare: mocks.compare,
  },
}));

import { authService } from "./auth.service";

const userRow = {
  id: 1,
  email: "lucas@kursa.dev",
  passwordHash: "hashed-password",
  role: "estudiante" as const,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
};

describe("authService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.insertValues.mockReturnValue({ returning: mocks.insertReturning });
    mocks.hash.mockResolvedValue("hashed-password");
    mocks.signAccessToken.mockReturnValue("access-token");
    mocks.signRefreshToken.mockReturnValue("refresh-token");
  });

  describe("register", () => {
    it("rechaza un correo ya registrado con 409", async () => {
      mocks.selectWhere.mockResolvedValue([userRow]);

      await expect(authService.register("lucas@kursa.dev", "123456")).rejects.toMatchObject({
        name: "AppError",
        statusCode: 409,
      });
      expect(mocks.hash).not.toHaveBeenCalled();
    });

    it("crea el usuario con rol por defecto y sin exponer el hash", async () => {
      mocks.selectWhere.mockResolvedValue([]);
      mocks.insertReturning.mockResolvedValue([userRow]);

      const user = await authService.register("lucas@kursa.dev", "123456");

      expect(mocks.insertValues).toHaveBeenCalledWith({
        email: "lucas@kursa.dev",
        passwordHash: "hashed-password",
        role: "estudiante",
      });
      expect(user).toEqual({
        id: 1,
        email: "lucas@kursa.dev",
        role: "estudiante",
        createdAt: userRow.createdAt,
      });
      expect(user).not.toHaveProperty("passwordHash");
    });

    it("traduce la violación de unicidad de PostgreSQL a 409", async () => {
      mocks.selectWhere.mockResolvedValue([]);
      mocks.insertReturning.mockRejectedValue({ code: "23505" });

      await expect(authService.register("lucas@kursa.dev", "123456")).rejects.toMatchObject({
        name: "AppError",
        statusCode: 409,
      });
    });

    it("propaga errores inesperados de base de datos", async () => {
      mocks.selectWhere.mockResolvedValue([]);
      const dbError = new Error("conexión perdida");
      mocks.insertReturning.mockRejectedValue(dbError);

      await expect(authService.register("lucas@kursa.dev", "123456")).rejects.toBe(dbError);
    });
  });

  describe("login", () => {
    it("rechaza credenciales de un usuario inexistente con 401", async () => {
      mocks.selectWhere.mockResolvedValue([]);

      await expect(authService.login("nadie@kursa.dev", "123456")).rejects.toMatchObject({
        name: "AppError",
        statusCode: 401,
      });
    });

    it("rechaza una contraseña incorrecta con 401", async () => {
      mocks.selectWhere.mockResolvedValue([userRow]);
      mocks.compare.mockResolvedValue(false);

      await expect(authService.login("lucas@kursa.dev", "incorrecta")).rejects.toMatchObject({
        name: "AppError",
        statusCode: 401,
      });
      expect(mocks.signAccessToken).not.toHaveBeenCalled();
    });

    it("devuelve usuario público y ambos tokens con credenciales válidas", async () => {
      mocks.selectWhere.mockResolvedValue([userRow]);
      mocks.compare.mockResolvedValue(true);

      const result = await authService.login("lucas@kursa.dev", "123456");

      expect(result).toEqual({
        user: {
          id: 1,
          email: "lucas@kursa.dev",
          role: "estudiante",
          createdAt: userRow.createdAt,
        },
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
      expect(result.user).not.toHaveProperty("passwordHash");
      expect(mocks.signAccessToken).toHaveBeenCalledWith({
        userId: 1,
        email: "lucas@kursa.dev",
        role: "estudiante",
      });
      expect(mocks.signRefreshToken).toHaveBeenCalledWith({ userId: 1 });
    });
  });

  describe("refresh", () => {
    it("rechaza un refresh token inválido con 401", async () => {
      mocks.verifyRefreshToken.mockImplementation(() => {
        throw new Error("invalid signature");
      });

      await expect(authService.refresh("token-invalido")).rejects.toMatchObject({
        name: "AppError",
        statusCode: 401,
      });
    });

    it("rechaza un refresh token sin userId con 401", async () => {
      mocks.verifyRefreshToken.mockReturnValue({});

      await expect(authService.refresh("token-invalido")).rejects.toMatchObject({
        name: "AppError",
        statusCode: 401,
      });
    });

    it("rechaza el refresh si el usuario ya no existe", async () => {
      mocks.verifyRefreshToken.mockReturnValue({ userId: 99 });
      mocks.selectWhere.mockResolvedValue([]);

      await expect(authService.refresh("refresh-token")).rejects.toMatchObject({
        name: "AppError",
        statusCode: 401,
      });
    });

    it("emite un access token actualizado con los datos vigentes del usuario", async () => {
      mocks.verifyRefreshToken.mockReturnValue({ userId: 1 });
      mocks.selectWhere.mockResolvedValue([userRow]);
      mocks.signAccessToken.mockReturnValue("nuevo-access-token");

      const result = await authService.refresh("refresh-token");

      expect(result).toEqual({ accessToken: "nuevo-access-token" });
      expect(mocks.signAccessToken).toHaveBeenCalledWith({
        userId: 1,
        email: "lucas@kursa.dev",
        role: "estudiante",
      });
    });
  });

  describe("getUserById", () => {
    it("devuelve null si el usuario no existe", async () => {
      mocks.selectWhere.mockResolvedValue([]);

      await expect(authService.getUserById(99)).resolves.toBeNull();
    });

    it("devuelve el usuario sin passwordHash", async () => {
      mocks.selectWhere.mockResolvedValue([userRow]);

      const user = await authService.getUserById(1);

      expect(user).toEqual({
        id: 1,
        email: "lucas@kursa.dev",
        role: "estudiante",
        createdAt: userRow.createdAt,
      });
      expect(user).not.toHaveProperty("passwordHash");
    });
  });
});
