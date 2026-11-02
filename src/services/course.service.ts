import { db } from "../config/db";
import { courses, subjects, lessons, enrollments } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const courseService = {
  async create(title: string, description: string | undefined, profesorId: number) {
    const [course] = await db.insert(courses).values({ title, description, profesorId }).returning();
    return course;
  },

  async list() {
    return await db.select().from(courses);
  },

  async getById(id: number) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || null;
  },

  async update(id: number, data: { title?: string; description?: string }) {
    const [course] = await db.update(courses).set(data).where(eq(courses.id, id)).returning();
    return course;
  },

  async delete(id: number) {
    await db.delete(courses).where(eq(courses.id, id));
  },
};

export const subjectService = {
  async create(courseId: number, title: string, order: number) {
    const [subject] = await db.insert(subjects).values({ courseId, title, order }).returning();
    return subject;
  },

  async listByCourse(courseId: number) {
    return await db.select().from(subjects).where(eq(subjects.courseId, courseId)).orderBy(subjects.order);
  },
};

export const lessonService = {
  async create(subjectId: number, title: string, contentType: string, contentUrl: string | undefined, order: number) {
    const [lesson] = await db.insert(lessons).values({ subjectId, title, contentType, contentUrl, order }).returning();
    return lesson;
  },

  async listBySubject(subjectId: number) {
    return await db.select().from(lessons).where(eq(lessons.subjectId, subjectId)).orderBy(lessons.order);
  },
};

export const enrollmentService = {
  async enroll(userId: number, courseId: number) {
    const [enrollment] = await db.insert(enrollments).values({ userId, courseId }).returning();
    return enrollment;
  },

  async isEnrolled(userId: number, courseId: number) {
    const [existing] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return !!existing;
  },
};
