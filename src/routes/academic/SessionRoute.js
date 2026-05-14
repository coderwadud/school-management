import {
  createSession,
  updateSession,
  getSessions,
  getSessionById,
  deleteSession,
  getSessionsOptions,
  toggleSessionStatus,
} from "../../controllers/academic/SessionController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getSessions);
router.get("/options", getSessionsOptions);
router.get("/:id", getSessionById);

// Protected routes (requires authentication)
router.post("/", authenticate, createSession);
router.put("/:id", authenticate, updateSession);
router.delete("/:id", authenticate, deleteSession);
router.patch("/:id/status", authenticate, toggleSessionStatus);

export default router;
