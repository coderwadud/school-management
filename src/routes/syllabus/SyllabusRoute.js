import {
  createSyllabus,
  getAllSyllabi,
  getSyllabusById,
  getSyllabusByClassAndSubject,
  updateSyllabus,
  deleteSyllabus,
  toggleSyllabusStatus,
} from "../../controllers/syllabus/SyllabusController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import upload from "../../utils/multer.js";

const router = express.Router();

router.post("/", authenticate, upload.single("syllabusFile"), createSyllabus);
router.get("/", authenticate, getAllSyllabi);
router.get("/search", authenticate, getSyllabusByClassAndSubject);
router.get("/:id", authenticate, getSyllabusById);
router.put("/:id", authenticate, upload.single("syllabusFile"), updateSyllabus);
router.delete("/:id", authenticate, deleteSyllabus);
router.patch("/:id/status", authenticate, toggleSyllabusStatus);

export default router;
