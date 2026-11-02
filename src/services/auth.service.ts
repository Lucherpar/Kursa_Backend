import { db } from "../config/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../config/jwt";
import { UserRole } from "../types";

export const authService = {
  async register(email: string, password: string, role: UserRole = "estudiante") {
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      throw new Error("El correo ya está registrado");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [created] = await db.insert(users).values({ email, passwordHash, role }).returning();
    return created;
  },

  async login(email: string, password: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error("Credenciales inválidas");
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
  },

  async getUserById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  },
};
