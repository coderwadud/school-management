import {
  createOnlineClass,
  getAllOnlineClasses,
  getOnlineClassById,
  updateOnlineClass,
  deleteOnlineClass,
  updateClassStatus,
  markAttendance,
  getUpcomingClasses,
} from "../../controllers/online/OnlineClassController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createOnlineClass);
router.get("/", authenticate, getAllOnlineClasses);
router.get("/upcoming", authenticate, getUpcomingClasses);
router.get("/:id", authenticate, getOnlineClassById);
router.put("/:id", authenticate, updateOnlineClass);
router.delete("/:id", authenticate, deleteOnlineClass);
router.patch("/:id/status", authenticate, updateClassStatus);
router.post("/:id/attendance", authenticate, markAttendance);

export default router;
