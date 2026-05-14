import {
  createMedium,
  getMediums,
  getMediumById,
  updateMedium,
  deleteMedium,
  toggleMediumStatus,
  getMediumsOptions,
} from "../../controllers/academic/MediumController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getMediums);
router.get("/options", getMediumsOptions);
router.get("/:id", getMediumById);

// Protected routes (requires authentication)
router.post("/", authenticate, createMedium);
router.put("/:id", authenticate, updateMedium);
router.delete("/:id", authenticate, deleteMedium);
router.patch("/:id/status", authenticate, toggleMediumStatus);

export default router;
