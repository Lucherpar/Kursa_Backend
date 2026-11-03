import { beforeAll, describe, expect, it } from "vitest";

process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/kursa_test";
process.env.JWT_SECRET = "test-access-secret";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
process.env.JWT_EXPIRES_IN = "15m";
process.env.REFRESH_TOKEN_EXPIRES_IN = "7d";

let jwt: typeof import("./jwt");

describe("config/jwt", () => {
  beforeAll(async () => {
    jwt = await import("./jwt");
  });

  it("firma y verifica un access token con sus claims", () => {
    const token = jwt.signAccessToken({ userId: 1, email: "lucas@kursa.dev", role: "estudiante" });

    expect(jwt.verifyAccessToken(token)).toMatchObject({
      userId: 1,
      email: "lucas@kursa.dev",
      role: "estudiante",
    });
  });

  it("firma y verifica un refresh token", () => {
    const token = jwt.signRefreshToken({ userId: 1 });

    expect(jwt.verifyRefreshToken(token)).toMatchObject({ userId: 1 });
  });

  it("no acepta un access token como refresh token", () => {
    const accessToken = jwt.signAccessToken({ userId: 1, email: "lucas@kursa.dev", role: "estudiante" });

    expect(() => jwt.verifyRefreshToken(accessToken)).toThrow();
  });

  it("no acepta un refresh token como access token", () => {
    const refreshToken = jwt.signRefreshToken({ userId: 1 });

    expect(() => jwt.verifyAccessToken(refreshToken)).toThrow();
  });

  it("rechaza tokens manipulados", () => {
    const token = jwt.signAccessToken({ userId: 1, email: "lucas@kursa.dev", role: "estudiante" });

    expect(() => jwt.verifyAccessToken(`${token}firma-manipulada`)).toThrow();
  });
});
