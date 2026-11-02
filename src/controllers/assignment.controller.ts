import { Request, Response } from "express";
import { assignmentService, submissionService, fileService, recordingService } from "../services/assignment.service";
import { successResponse, errorResponse } from "../utils/response";
import { HTTP_STATUS } from "../utils/constants";
import { assignmentSchema } from "../types/schemas";
import { AuthenticatedRequest } from "../types";
import { upload } from "../middleware/upload";

export const assignmentController = {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = assignmentSchema.parse(req.body);
      const assignment = await assignmentService.create(data.subjectId, data.title, data.description, data.dueDate, data.maxFiles);
      res.status(HTTP_STATUS.CREATED).json(successResponse(assignment, "Tarea creada"));
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }
  },

  async listBySubject(req: Request, res: Response): Promise<void> {
    try {
      const assignments = await assignmentService.listBySubject(parseInt(req.params.subjectId));
      res.json(successResponse(assignments));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },

  async submit(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const files = req.files as Express.Multer.File[];
      const fileUrls = files.map((f) => `/uploads/${f.filename}`);
      const submission = await submissionService.create(assignmentId, req.user!.userId, fileUrls);
      res.status(HTTP_STATUS.CREATED).json(successResponse(submission, "Entrega registrada"));
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }
  },

  async listByAssignment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const submissions = await submissionService.listByAssignment(parseInt(req.params.assignmentId));
      res.json(successResponse(submissions));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },

  async grade(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const submissionId = parseInt(req.params.submissionId);
      const { grade, feedback } = req.body;
      const submission = await submissionService.grade(submissionId, grade, feedback);
      res.json(successResponse(submission, "Calificación registrada"));
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }
  },
};

export const uploadController = {
  async uploadFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse("No se subió archivo"));
        return;
      }
      const uploaded = await fileService.create(file.originalname, file.mimetype, `/uploads/${file.filename}`, req.user!.userId);
      res.status(HTTP_STATUS.CREATED).json(successResponse(uploaded, "Archivo subido"));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },
};

export const recordingController = {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { subjectId, url } = req.body;
      const recording = await recordingService.create(subjectId, url);
      res.status(HTTP_STATUS.CREATED).json(successResponse(recording, "Grabación registrada"));
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }
  },

  async listBySubject(req: Request, res: Response): Promise<void> {
    try {
      const recordings = await recordingService.listBySubject(parseInt(req.params.subjectId));
      res.json(successResponse(recordings));
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse(error.message));
    }
  },
};
