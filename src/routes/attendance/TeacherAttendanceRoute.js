import {
  takeAttendance,
  getAttendanceByDate,
  getTeacherAttendanceReport,
  getMonthlyAttendanceSummary,
  deleteAttendance,
} from "../../controllers/attendance/TeacherAttendanceController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", authenticate, takeAttendance);
router.get("/date", authenticate, getAttendanceByDate);
router.get("/teacher/:teacherId", authenticate, getTeacherAttendanceReport);
router.get("/monthly-summary", authenticate, getMonthlyAttendanceSummary);
router.delete("/:id", authenticate, deleteAttendance);

export default router;
