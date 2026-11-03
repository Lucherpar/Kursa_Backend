import { db } from "../config/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../config/jwt";
import { HTTP_STATUS } from "../utils/constants";
import { AppError } from "../utils/errors";
import { JWTPayload, UserRole } from "../types";

const BCRYPT_ROUNDS = 10;

type UserRow = typeof users.$inferSelect;
type PublicUser = Omit<UserRow, "passwordHash">;

const toPublicUser = (user: UserRow): PublicUser => {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
};

const isUniqueViolation = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
};

const findPublicUserById = async (id: number): Promise<PublicUser | null> => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user ? toPublicUser(user) : null;
};

export const authService = {
  async register(email: string, password: string, role: UserRole = "estudiante"): Promise<PublicUser> {
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      throw new AppError("El correo ya está registrado", HTTP_STATUS.CONFLICT);
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    try {
      const [created] = await db.insert(users).values({ email, passwordHash, role }).returning();
      if (!created) {
        throw new AppError("No se pudo registrar el usuario", HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }
      return toPublicUser(created);
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        throw new AppError("El correo ya está registrado", HTTP_STATUS.CONFLICT);
      }
      throw error;
    }
  },

  async login(email: string, password: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      throw new AppError("Credenciales inválidas", HTTP_STATUS.UNAUTHORIZED);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError("Credenciales inválidas", HTTP_STATUS.UNAUTHORIZED);
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });

    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    let decoded: Partial<JWTPayload>;

    try {
      decoded = verifyRefreshToken(refreshToken) as Partial<JWTPayload>;
    } catch {
      throw new AppError("Refresh token inválido o expirado", HTTP_STATUS.UNAUTHORIZED);
    }

    if (typeof decoded.userId !== "number") {
      throw new AppError("Refresh token inválido o expirado", HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await findPublicUserById(decoded.userId);
    if (!user) {
      throw new AppError("Refresh token inválido o expirado", HTTP_STATUS.UNAUTHORIZED);
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  },

  async getUserById(id: number): Promise<PublicUser | null> {
    return findPublicUserById(id);
  },
};
