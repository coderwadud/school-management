import {
  createClassWiseSubjects,
  getClassWiseSubjects,
  updateClassWiseSubjects,
  deleteClassWiseSubjects,
  getClassWiseSubjectsById,
  toggleClassWiseSubjectsStatus,
  getClassWiseSubjectsOptions,
} from "../../controllers/academic/ClassWiseSubjects.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", authenticate, createClassWiseSubjects);
router.get("/", getClassWiseSubjects);
router.get("/options", getClassWiseSubjectsOptions);
router.get("/:id", getClassWiseSubjectsById);
router.put("/:id", authenticate, updateClassWiseSubjects);
router.delete("/:id", authenticate, deleteClassWiseSubjects);
router.patch("/:id/status", authenticate, toggleClassWiseSubjectsStatus);

export default router;
