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
const router = express.Router();
router.post("/", createSection);
router.get("/", getSections);
router.get("/options", getSectionsOptions);
router.get("/:id", getSectionById);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);
router.patch("/:id/status", toggleSectionStatus);
export default router;
