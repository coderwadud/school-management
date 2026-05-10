import { createBranch, getBranches, getBranchById, updateBranch, deleteBranch, toggleBranchStatus, getBranchesOptions } from "../controllers/BranchController.js";
import express from "express";
const router = express.Router();
// POST /api/v1/branches
router.post("/", createBranch);
router.get("/", getBranches);
router.get("/options", getBranchesOptions);
router.get("/:id", getBranchById);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);
router.patch("/:id/status", toggleBranchStatus);

export default router;
