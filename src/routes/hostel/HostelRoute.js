import {
  createHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
  toggleHostelStatus,
} from "../../controllers/hostel/HostelController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllHostels);
router.get("/:id", getHostelById);
router.post("/", authenticate, createHostel);
router.put("/:id", authenticate, updateHostel);
router.delete("/:id", authenticate, deleteHostel);
router.patch("/:id/status", authenticate, toggleHostelStatus);

export default router;
