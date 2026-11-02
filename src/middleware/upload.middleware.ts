import multer from "multer";
import { ALLOWED_MIME_TYPES } from "../utils/constants";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
    files: 10,
  },
});
