import { db } from "../config/db";
import { assignments, submissions, files, recordings } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const assignmentService = {
  async create(subjectId: number, title: string, description: string | undefined, dueDate: string | undefined, maxFiles: number) {
    const [assignment] = await db
      .insert(assignments)
      .values({
        subjectId,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        maxFiles,
      })
      .returning();
    return assignment;
  },

  async listBySubject(subjectId: number) {
    return await db.select().from(assignments).where(eq(assignments.subjectId, subjectId));
  },

  async getById(id: number) {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment || null;
  },
};

export const submissionService = {
  async create(assignmentId: number, studentId: number, fileUrls: string[]) {
    const [submission] = await db.insert(submissions).values({ assignmentId, studentId, fileUrls }).returning();
    return submission;
  },

  async listByAssignment(assignmentId: number) {
    return await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
  },

  async getByAssignmentAndStudent(assignmentId: number, studentId: number) {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.studentId, studentId)));
    return submission || null;
  },

  async grade(submissionId: number, grade: number, feedback: string | undefined) {
    const [submission] = await db.update(submissions).set({ grade, feedback }).where(eq(submissions.id, submissionId)).returning();
    return submission;
  },
};

export const fileService = {
  async create(originalName: string, mimeType: string, url: string, uploadedBy: number | undefined) {
    const [file] = await db.insert(files).values({ originalName, mimeType, url, uploadedBy }).returning();
    return file;
  },
};

export const recordingService = {
  async create(subjectId: number, url: string) {
    const [recording] = await db.insert(recordings).values({ subjectId, url }).returning();
    return recording;
  },

  async listBySubject(subjectId: number) {
    return await db.select().from(recordings).where(eq(recordings.subjectId, subjectId));
  },
};
