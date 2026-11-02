import { Server } from "socket.io";
import { createServer } from "http";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export function initSocket(httpServer: ReturnType<typeof createServer>) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.SOCKET_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info("Usuario conectado al socket:", socket.id);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      logger.info(`Socket ${socket.id} se unió a la sala ${roomId}`);
    });

    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on("call-signal", (data: { roomId: string; signal: any; to: string }) => {
      io.to(data.to).emit("call-signal", { from: socket.id, signal: data.signal });
    });

    socket.on("chat-message", (data: { roomId: string; user: string; message: string }) => {
      io.to(data.roomId).emit("chat-message", { user: data.user, message: data.message, timestamp: new Date().toISOString() });
    });

    socket.on("disconnect", () => {
      logger.info("Usuario desconectado:", socket.id);
    });
  });

  return io;
}
