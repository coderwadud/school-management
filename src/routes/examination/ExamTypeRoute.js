import {
  createExamType,
  getAllExamTypes,
  getExamTypeById,
  updateExamType,
  deleteExamType,
  toggleExamTypeStatus,
} from "../../controllers/examination/ExamTypeController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllExamTypes);
router.get("/:id", getExamTypeById);
router.post("/", authenticate, createExamType);
router.put("/:id", authenticate, updateExamType);
router.delete("/:id", authenticate, deleteExamType);
router.patch("/:id/status", authenticate, toggleExamTypeStatus);

export default router;
