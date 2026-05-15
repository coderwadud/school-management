import {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
  getSectionsOptions,
  toggleSectionStatus,
} from "../../controllers/academic/SectionController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getSections);
router.get("/options", getSectionsOptions);
router.get("/:id", getSectionById);

// Protected routes (requires authentication)
router.post("/", authenticate, createSection);
router.put("/:id", authenticate, updateSection);
router.delete("/:id", authenticate, deleteSection);
router.patch("/:id/status", authenticate, toggleSectionStatus);

export default router;
