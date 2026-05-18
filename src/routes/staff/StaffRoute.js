import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  getStaffOptions,
} from "../../controllers/staff/StaffController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { fieldsUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllStaff);
router.get("/options", getStaffOptions);
router.get("/:id", getStaffById);

// Protected routes (requires authentication)
router.post(
  "/",
  authenticate,
  fieldsUpload([{ name: "image", maxCount: 1 }]),
  createStaff,
);
router.put(
  "/:id",
  authenticate,
  fieldsUpload([{ name: "image", maxCount: 1 }]),
  updateStaff,
);
router.delete("/:id", authenticate, deleteStaff);
router.patch("/:id/status", authenticate, toggleStaffStatus);

export default router;
