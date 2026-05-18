import {
  submitHomework,
  getHomeworkSubmissions,
  getStudentSubmissions,
  evaluateHomework,
  deleteSubmission,
} from "../../controllers/homework/HomeworkSubmissionController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { fieldsUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  fieldsUpload([{ name: "attachments", maxCount: 5 }]),
  submitHomework,
);
router.get("/homework/:homeworkId", authenticate, getHomeworkSubmissions);
router.get("/student/:studentId", authenticate, getStudentSubmissions);
router.patch("/:id/evaluate", authenticate, evaluateHomework);
router.delete("/:id", authenticate, deleteSubmission);

export default router;
