import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  toggleClassStatus,
  getClassesOptions,
} from "../../controllers/academic/ClassController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getClasses);
router.get("/options", getClassesOptions);
router.get("/:id", getClassById);

// Protected routes (requires authentication)
router.post("/", authenticate, createClass);
router.put("/:id", authenticate, updateClass);
router.delete("/:id", authenticate, deleteClass);
router.patch("/:id/status", authenticate, toggleClassStatus);

export default router;
