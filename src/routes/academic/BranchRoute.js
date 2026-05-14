import {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  toggleBranchStatus,
  getBranchesOptions,
} from "../../controllers/academic/BranchController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getBranches);
router.get("/options", getBranchesOptions);
router.get("/:id", getBranchById);

// Protected routes (requires authentication)
router.post("/", authenticate, createBranch);
router.put("/:id", authenticate, updateBranch);
router.delete("/:id", authenticate, deleteBranch);
router.patch("/:id/status", authenticate, toggleBranchStatus);

export default router;
