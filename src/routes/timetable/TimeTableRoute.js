import {
  createTimeTable,
  getTimeTable,
  updateTimeTable,
  getTimeTableById,
  deleteTimeTable,
  toggleTimeTableStatus,
} from "../../controllers/timetable/TimeTableController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createTimeTable);
router.get("/", getTimeTable);
router.get("/:id", authenticate, getTimeTableById);
router.put("/:id", authenticate, updateTimeTable);
router.delete("/:id", authenticate, deleteTimeTable);
router.patch("/:id/status", authenticate, toggleTimeTableStatus);

export default router;
