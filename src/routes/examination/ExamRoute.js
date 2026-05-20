import {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getExamSchedule,
  createExamSchedule,
  updateExamSchedule,
  deleteExamSchedule,
} from "../../controllers/examination/ExamController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Exam routes
router.get("/", getAllExams);
router.get("/:id", getExamById);
router.post("/", authenticate, createExam);
router.put("/:id", authenticate, updateExam);
router.delete("/:id", authenticate, deleteExam);

// Exam schedule routes
router.get("/:examId/schedule", getExamSchedule);
router.post("/schedule", authenticate, createExamSchedule);
router.put("/schedule/:id", authenticate, updateExamSchedule);
router.delete("/schedule/:id", authenticate, deleteExamSchedule);

export default router;
