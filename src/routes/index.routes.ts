import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { registerSchema, loginSchema } from "../types/schemas";
import { courseController, subjectController, lessonController } from "../controllers/course.controller";
import { assignmentController, uploadController, recordingController } from "../controllers/assignment.controller";
import { upload } from "../middleware/upload.middleware";
import { USER_ROLES } from "../utils/constants";

const router = Router();

// Auth
router.post("/auth/register", validate(registerSchema), authController.register);
router.post("/auth/login", validate(loginSchema), authController.login);
router.post("/auth/refresh", authController.refresh);
router.get("/auth/me", authenticate, authController.me);

// Cursos
router.get("/courses", courseController.list);
router.get("/courses/:id", courseController.getById);
router.post("/courses", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), courseController.create);
router.post("/courses/:courseId/enroll", authenticate, courseController.enroll);
router.get("/courses/:courseId/enrolled", authenticate, courseController.isEnrolled);

// Asignaturas
router.get("/courses/:courseId/subjects", subjectController.listByCourse);
router.post("/subjects", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), subjectController.create);

// Lecciones
router.get("/subjects/:subjectId/lessons", lessonController.listByLesson);
router.post("/lessons", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), lessonController.create);

// Tareas
router.get("/subjects/:subjectId/assignments", assignmentController.listBySubject);
router.post("/assignments", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), assignmentController.create);
router.post("/assignments/:assignmentId/submit", authenticate, upload.array("files", 10), assignmentController.submit);
router.get("/assignments/:assignmentId/submissions", authenticate, assignmentController.listByAssignment);
router.patch("/submissions/:submissionId/grade", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), assignmentController.grade);

// Archivos
router.post("/upload", authenticate, upload.single("file"), uploadController.uploadFile);

// Grabaciones
router.get("/subjects/:subjectId/recordings", recordingController.listBySubject);
router.post("/recordings", authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.PROFESOR), recordingController.create);

export default router;
