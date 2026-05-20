import {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
  toggleAdminUserStatus,
} from "../../controllers/user/AdminUserController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createAdminUser);
router.get("/", authenticate, getAllAdminUsers);
router.get("/:id", authenticate, getAdminUserById);
router.put("/:id", authenticate, updateAdminUser);
router.delete("/:id", authenticate, deleteAdminUser);
router.patch("/:id/status", authenticate, toggleAdminUserStatus);

export default router;
