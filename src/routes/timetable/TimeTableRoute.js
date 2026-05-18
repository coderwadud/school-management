import {
  createTimeTable,
  getTimeTableByClass,
  getTimeTableByDay,
  getTeacherTimeTable,
  updateTimeTable,
  deleteTimeTable,
  toggleTimeTableStatus,
} from "../../controllers/timetable/TimeTableController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createTimeTable);
router.get("/", authenticate, getTimeTableByClass);
router.get("/day", authenticate, getTimeTableByDay);
router.get("/teacher/:teacherId", authenticate, getTeacherTimeTable);
router.put("/:id", authenticate, updateTimeTable);
router.delete("/:id", authenticate, deleteTimeTable);
router.patch("/:id/status", authenticate, toggleTimeTableStatus);

export default router;
