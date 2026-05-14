import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  toggleTeacherStatus,
  getTeacherOptions,
} from "../../controllers/teacher/TeacherController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllTeachers);
router.get("/options", getTeacherOptions);
router.get("/:id", getTeacherById);

// Protected routes (requires authentication)
router.post("/", authenticate, createTeacher);
router.put("/:id", authenticate, updateTeacher);
router.delete("/:id", authenticate, deleteTeacher);
router.patch("/:id/status", authenticate, toggleTeacherStatus);

export default router;
