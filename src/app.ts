import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./routes/index.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { initSocket } from "./socket/socket.server";
import { createServer } from "http";

export const app: Application = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Demasiadas solicitudes, intente de nuevo más tarde" },
});
app.use(limiter);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export const httpServer = createServer(app);
export const io = initSocket(httpServer);

if (process.env.NODE_ENV !== "test") {
  httpServer.listen(env.PORT, () => {
    logger.info(`Servidor corriendo en http://localhost:${env.PORT}`);
  });
}
