import { describe, it, expect } from "vitest";
import { successResponse, errorResponse } from "./response";

describe("helpers de respuesta", () => {
  it("successResponse devuelve success true con datos y mensaje", () => {
    expect(successResponse({ id: 1 }, "ok")).toEqual({
      success: true,
      message: "ok",
      data: { id: 1 },
    });
  });

  it("errorResponse devuelve success false", () => {
    expect(errorResponse("fallo")).toEqual({
      success: false,
      message: "fallo",
      error: undefined,
    });
  });
});
