import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { HTTP_STATUS } from "../utils/constants";
import { errorResponse } from "../utils/response";

interface ValidationIssue {
  path: Array<string | number>;
  message: string;
}

const formatIssues = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error === null || !("errors" in error)) {
    return undefined;
  }

  const issues = (error as { errors: ValidationIssue[] }).errors;
  return issues.map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`).join("; ");
};

export const validate = (schema: ZodSchema, property: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[property]);
      // Conserva los valores transformados por Zod (por ejemplo, defaults).
      (req as unknown as Record<string, unknown>)[property] = parsed;
      next();
    } catch (error: unknown) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse("Error de validación", formatIssues(error)));
    }
  };
};
