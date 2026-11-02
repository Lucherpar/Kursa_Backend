import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { HTTP_STATUS } from "../utils/constants";
import { errorResponse } from "../utils/response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error("Error no controlado:", err.message, err.stack);

  const status = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || "Error interno del servidor";

  res.status(status).json(errorResponse(message, process.env.NODE_ENV === "development" ? err.stack : undefined));
};

export const notFound = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Ruta no encontrada"));
};
