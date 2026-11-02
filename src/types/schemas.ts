import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["admin", "profesor", "estudiante"]).default("estudiante"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export const courseSchema = z.object({
  title: z.string().min(1, "Título requerido"),
  description: z.string().optional(),
});

export const subjectSchema = z.object({
  courseId: z.number().int().positive(),
  title: z.string().min(1, "Título requerido"),
  order: z.number().int().nonnegative().default(0),
});

export const lessonSchema = z.object({
  subjectId: z.number().int().positive(),
  title: z.string().min(1, "Título requerido"),
  contentType: z.enum(["text", "image", "video", "file"]).default("text"),
  contentUrl: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
});

export const assignmentSchema = z.object({
  subjectId: z.number().int().positive(),
  title: z.string().min(1, "Título requerido"),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  maxFiles: z.number().int().positive().default(5),
});
