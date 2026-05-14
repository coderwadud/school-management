import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  toggleGroupStatus,
  getGroupsOptions,
} from "../../controllers/academic/GroupController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getGroups);
router.get("/options", getGroupsOptions);
router.get("/:id", getGroupById);

// Protected routes (requires authentication)
router.post("/", authenticate, createGroup);
router.put("/:id", authenticate, updateGroup);
router.delete("/:id", authenticate, deleteGroup);
router.patch("/:id/status", authenticate, toggleGroupStatus);

export default router;
