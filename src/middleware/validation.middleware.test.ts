import { describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { validate } from "./validation.middleware";

const createResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);
  return response as unknown as Response & typeof response;
};

describe("validate", () => {
  it("acepta datos válidos y conserva los valores transformados por Zod", () => {
    const req = { body: { title: "Curso" } } as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    validate(z.object({ title: z.string(), order: z.number().default(0) }))(req, res, next);

    expect(req.body).toEqual({ title: "Curso", order: 0 });
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("responde 400 con el detalle de los campos inválidos", () => {
    const req = { body: { email: "no-es-email" } } as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    validate(z.object({ email: z.string().email("Email inválido") }))(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error de validación",
      error: "email: Email inválido",
    });
  });
});
