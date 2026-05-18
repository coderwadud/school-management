import {
  takeAttendance,
  getAttendanceByClassAndDate,
  getStudentAttendanceReport,
  getMonthlyAttendanceSummary,
  deleteAttendance,
} from "../../controllers/attendance/StudentAttendanceController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", authenticate, takeAttendance);
router.get("/class", authenticate, getAttendanceByClassAndDate);
router.get("/student/:studentId", authenticate, getStudentAttendanceReport);
router.get("/monthly-summary", authenticate, getMonthlyAttendanceSummary);
router.delete("/:id", authenticate, deleteAttendance);

export default router;
