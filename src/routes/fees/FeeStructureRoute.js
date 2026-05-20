import {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  deleteFeeStructure,
} from "../../controllers/fees/FeeStructureController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllFeeStructures);
router.get("/:id", getFeeStructureById);
router.post("/", authenticate, createFeeStructure);
router.put("/:id", authenticate, updateFeeStructure);
router.delete("/:id", authenticate, deleteFeeStructure);

export default router;
