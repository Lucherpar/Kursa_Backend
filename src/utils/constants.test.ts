import { describe, it, expect } from "vitest";
import { HTTP_STATUS, USER_ROLES } from "./constants";

describe("constantes", () => {
  it("HTTP_STATUS contiene los códigos esperados", () => {
    expect(HTTP_STATUS.OK).toBe(200);
    expect(HTTP_STATUS.CREATED).toBe(201);
    expect(HTTP_STATUS.NOT_FOUND).toBe(404);
  });

  it("USER_ROLES define los tres roles del sistema", () => {
    expect(Object.values(USER_ROLES)).toEqual(["admin", "profesor", "estudiante"]);
  });
});
