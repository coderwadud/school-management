import {
  applyLeave,
  getAllLeaves,
  getLeaveById,
  getApplicantLeaveHistory,
  getPendingLeaves,
  updateLeaveStatus,
  cancelLeave,
  deleteLeave,
  getLeaveBalance,
} from "../../controllers/leave/LeaveController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, applyLeave);
router.get("/", authenticate, getAllLeaves);
router.get("/pending", authenticate, getPendingLeaves);
router.get("/:id", authenticate, getLeaveById);
router.get(
  "/applicant/:applicantType/:applicantId",
  authenticate,
  getApplicantLeaveHistory,
);
router.get(
  "/balance/:applicantType/:applicantId",
  authenticate,
  getLeaveBalance,
);
router.patch("/:id/status", authenticate, updateLeaveStatus);
router.patch("/:id/cancel", authenticate, cancelLeave);
router.delete("/:id", authenticate, deleteLeave);

export default router;
