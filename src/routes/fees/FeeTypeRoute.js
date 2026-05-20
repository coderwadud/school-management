import {
  createFeeType,
  getAllFeeTypes,
  getFeeTypeById,
  updateFeeType,
  deleteFeeType,
  toggleFeeTypeStatus,
} from "../../controllers/fees/FeeTypeController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllFeeTypes);
router.get("/:id", getFeeTypeById);
router.post("/", authenticate, createFeeType);
router.put("/:id", authenticate, updateFeeType);
router.delete("/:id", authenticate, deleteFeeType);
router.patch("/:id/status", authenticate, toggleFeeTypeStatus);

export default router;
