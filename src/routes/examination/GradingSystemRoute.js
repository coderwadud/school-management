import {
  createGradingSystem,
  getAllGradingSystems,
  getGradingSystemById,
  updateGradingSystem,
  deleteGradingSystem,
  toggleGradingSystemStatus,
} from "../../controllers/examination/GradingSystemController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllGradingSystems);
router.get("/:id", getGradingSystemById);
router.post("/", authenticate, createGradingSystem);
router.put("/:id", authenticate, updateGradingSystem);
router.delete("/:id", authenticate, deleteGradingSystem);
router.patch("/:id/status", authenticate, toggleGradingSystemStatus);

export default router;
