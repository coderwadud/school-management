import {
  createShift,
  getShifts,
  getShiftById,
  updateShift,
  deleteShift,
  toggleShiftStatus,
  getShiftsOptions,
} from "../../controllers/academic/ShiftController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getShifts);
router.get("/options", getShiftsOptions);
router.get("/:id", getShiftById);

// Protected routes (requires authentication)
router.post("/", authenticate, createShift);
router.put("/:id", authenticate, updateShift);
router.delete("/:id", authenticate, deleteShift);
router.patch("/:id/status", authenticate, toggleShiftStatus);

export default router;
