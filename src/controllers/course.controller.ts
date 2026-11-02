import { Request, Response } from "express";
import { courseService, subjectService, lessonService, enrollmentService } from "../services/course.service";
import { successResponse, errorResponse } from "../utils/response";
import { HTTP_STATUS } from "../utils/constants";
import { courseSchema, subjectSchema, lessonSchema } from "../types/schemas";
import { AuthenticatedRequest } from "../types";

export const courseController = {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = courseSchema.parse(req.body);
      const course = await courseService.create(data.title, data.description, req.user!.userId);
      res.status(HTTP_STATUS.CREATED).json(successResponse(course, "Curso creado"));
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    try {
      const courses = await courseService.list();
      res.json(successResponse(courses));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const course = await courseService.getById(parseInt(req.params.id));
      if (!course) {
        res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Curso no encontrado"));
        return;
      }
      res.json(successResponse(course));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },

  async enroll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const courseId = parseInt(req.params.courseId);
      const enrollment = await enrollmentService.enroll(req.user!.userId, courseId);
      res.status(HTTP_STATUS.CREATED).json(successResponse(enrollment, "Inscripción exitosa"));
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }
  },

  async isEnrolled(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const courseId = parseInt(req.params.courseId);
      const enrolled = await enrollmentService.isEnrolled(req.user!.userId, courseId);
      res.json(successResponse({ enrolled }));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },
};

export const subjectController = {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = subjectSchema.parse(req.body);
      const subject = await subjectService.create(data.courseId, data.title, data.order);
      res.status(HTTP_STATUS.CREATED).json(successResponse(subject, "Asignatura creada"));
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }
  },

  async listByCourse(req: Request, res: Response): Promise<void> {
    try {
      const subjects = await subjectService.listByCourse(parseInt(req.params.courseId));
      res.json(successResponse(subjects));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },
};

export const lessonController = {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = lessonSchema.parse(req.body);
      const lesson = await lessonService.create(data.subjectId, data.title, data.contentType, data.contentUrl, data.order);
      res.status(HTTP_STATUS.CREATED).json(successResponse(lesson, "Lección creada"));
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }
  },

  async listBySubject(req: Request, res: Response): Promise<void> {
    try {
      const lessons = await lessonService.listBySubject(parseInt(req.params.subjectId));
      res.json(successResponse(lessons));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },
};
