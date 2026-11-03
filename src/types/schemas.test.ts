import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  courseSchema,
  subjectSchema,
  lessonSchema,
  assignmentSchema,
} from "./schemas";

describe("schemas de validación", () => {
  it("registerSchema acepta datos válidos y aplica rol por defecto", () => {
    const result = registerSchema.parse({ email: "alumno@kursa.dev", password: "123456" });
    expect(result.role).toBe("estudiante");
  });

  it("registerSchema rechaza emails inválidos", () => {
    expect(() => registerSchema.parse({ email: "no-es-email", password: "123456" })).toThrow();
  });

  it("registerSchema rechaza contraseñas cortas", () => {
    expect(() => registerSchema.parse({ email: "a@b.com", password: "123" })).toThrow();
  });

  it("loginSchema acepta credenciales válidas", () => {
    expect(loginSchema.parse({ email: "a@b.com", password: "x" })).toEqual({
      email: "a@b.com",
      password: "x",
    });
  });

  it("courseSchema exige título", () => {
    expect(() => courseSchema.parse({ description: "sin título" })).toThrow();
  });

  it("subjectSchema aplica order por defecto", () => {
    expect(subjectSchema.parse({ courseId: 1, title: "Matemáticas" }).order).toBe(0);
  });

  it("lessonSchema aplica contentType por defecto", () => {
    expect(lessonSchema.parse({ subjectId: 1, title: "Tema 1" }).contentType).toBe("text");
  });

  it("assignmentSchema valida maxFiles", () => {
    expect(assignmentSchema.parse({ subjectId: 1, title: "Tarea", maxFiles: 3 }).maxFiles).toBe(3);
  });
});
