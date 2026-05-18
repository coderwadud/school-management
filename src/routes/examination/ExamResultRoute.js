import {
  generateStudentResult,
  generateClassResults,
  getStudentResult,
  getClassResults,
  publishResults,
  getFailList,
} from "../../controllers/examination/ExamResultController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/generate/student", authenticate, generateStudentResult);
router.post("/generate/class", authenticate, generateClassResults);
router.get("/student", authenticate, getStudentResult);
router.get("/class", authenticate, getClassResults);
router.post("/publish", authenticate, publishResults);
router.get("/fail-list", authenticate, getFailList);

export default router;
