import {
  enterMarks,
  bulkEnterMarks,
  getMarksByExamAndSubject,
  getStudentMarks,
  updateMarks,
  deleteMarks,
} from "../../controllers/examination/ExamMarksController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", authenticate, enterMarks);
router.post("/bulk", authenticate, bulkEnterMarks);
router.get("/exam-subject", authenticate, getMarksByExamAndSubject);
router.get("/student", authenticate, getStudentMarks);
router.put("/:id", authenticate, updateMarks);
router.delete("/:id", authenticate, deleteMarks);

export default router;
