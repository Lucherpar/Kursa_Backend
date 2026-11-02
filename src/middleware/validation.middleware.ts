import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

export const validate = (schema: ZodSchema, property: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req[property]);
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: "Error de validación",
        error: error.errors,
      });
    }
  };
};
