import { HTTP_STATUS } from "./constants";

/**
 * Error de dominio con código HTTP asociado.
 *
 * Permite que los servicios expresen el resultado de una regla de negocio
 * sin depender de Express y que el `errorHandler` construya la respuesta.
 */
export class AppError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
