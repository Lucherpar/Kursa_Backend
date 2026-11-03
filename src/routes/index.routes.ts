import { Router, RequestHandler, Response } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { registerSchema, loginSchema } from "../types/schemas";
import { courseController, subjectController, lessonController } from "../controllers/course.controller";
import { assignmentController, uploadController, recordingController } from "../controllers/assignment.controller";
import { upload } from "../middleware/upload.middleware";
import { USER_ROLES } from "../utils/constants";
import { AuthenticatedRequest } from "../types";

const handler = (
  fn: (req: AuthenticatedRequest, res: Response) => Promise<void> | void
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req as AuthenticatedRequest, res)).catch(next);
  };
};

const router = Router();

// Auth
router.post("/auth/register", validate(registerSchema), handler(authController.register));
router.post("/auth/login", validate(loginSchema), handler(authController.login));
router.post("/auth/refresh", handler(authController.refresh));
router.get("/auth/me", authenticate, handler(authController.me));

// Cursos
router.get("/courses", handler(courseController.list));
router.get("/courses/:id", handler(courseController.getById));
router.post("/courses", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), handler(courseController.create));
router.post("/courses/:courseId/enroll", authenticate, handler(courseController.enroll));
router.get("/courses/:courseId/enrolled", authenticate, handler(courseController.isEnrolled));

// Asignaturas
router.get("/courses/:courseId/subjects", handler(subjectController.listByCourse));
router.post("/subjects", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), handler(subjectController.create));

// Lecciones
router.get("/subjects/:subjectId/lessons", handler(lessonController.listBySubject));
router.post("/lessons", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), handler(lessonController.create));

// Tareas
router.get("/subjects/:subjectId/assignments", handler(assignmentController.listBySubject));
router.post("/assignments", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), handler(assignmentController.create));
router.post("/assignments/:assignmentId/submit", authenticate, upload.array("files", 10), handler(assignmentController.submit));
router.get("/assignments/:assignmentId/submissions", authenticate, handler(assignmentController.listByAssignment));
router.patch("/submissions/:submissionId/grade", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), handler(assignmentController.grade));

// Archivos
router.post("/upload", authenticate, upload.single("file"), handler(uploadController.uploadFile));

// Grabaciones
router.get("/subjects/:subjectId/recordings", handler(recordingController.listBySubject));
router.post("/recordings", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), handler(recordingController.create));

export default router;
