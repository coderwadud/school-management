import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissions,
} from "../../controllers/user/RoleController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createRole);
router.get("/", authenticate, getAllRoles);
router.get("/:id", authenticate, getRoleById);
router.put("/:id", authenticate, updateRole);
router.delete("/:id", authenticate, deleteRole);
router.post("/:id/permissions", authenticate, assignPermissions);

export default router;
