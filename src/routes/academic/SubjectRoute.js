import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  toggleSubjectStatus,
  getSubjectsOptions,
} from "../../controllers/academic/SubjectController.js";

import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
const router = express.Router();

// Public routes
router.get("/", getSubjects);
router.get("/options", getSubjectsOptions);
router.get("/:id", getSubjectById);
// Protected routes (requires authentication)
router.post("/", authenticate, createSubject);
router.put("/:id", authenticate, updateSubject);
router.delete("/:id", authenticate, deleteSubject);
router.patch("/:id/status", authenticate, toggleSubjectStatus);

export default router;
