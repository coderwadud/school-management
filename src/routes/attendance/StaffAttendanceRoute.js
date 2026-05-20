import {
  takeAttendance,
  getAttendanceByDate,
  getStaffAttendanceReport,
  getMonthlyAttendanceSummary,
  deleteAttendance,
} from "../../controllers/attendance/StaffAttendanceController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, takeAttendance);
router.get("/date", authenticate, getAttendanceByDate);
router.get("/staff/:staffId", authenticate, getStaffAttendanceReport);
router.get("/monthly-summary", authenticate, getMonthlyAttendanceSummary);
router.delete("/:id", authenticate, deleteAttendance);

export default router;
