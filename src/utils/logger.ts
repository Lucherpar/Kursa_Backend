import { createWriteStream } from "fs";
import { join } from "path";

const logDir = process.env.LOG_DIR || join(process.cwd(), "logs");
let logFile: NodeJS.WritableStream | null = null;

try {
  logFile = createWriteStream(join(logDir, "app.log"), { flags: "a" });
} catch {
  logFile = null;
}

export const logger = {
  info: (message: string, ...args: any[]) => {
    const entry = `[INFO] ${new Date().toISOString()} ${message} ${args.join(" ")}`;
    console.log(entry);
    logFile?.write(entry + "\n");
  },
  warn: (message: string, ...args: any[]) => {
    const entry = `[WARN] ${new Date().toISOString()} ${message} ${args.join(" ")}`;
    console.warn(entry);
    logFile?.write(entry + "\n");
  },
  error: (message: string, ...args: any[]) => {
    const entry = `[ERROR] ${new Date().toISOString()} ${message} ${args.join(" ")}`;
    console.error(entry);
    logFile?.write(entry + "\n");
  },
};
