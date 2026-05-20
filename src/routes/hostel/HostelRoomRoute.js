import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../../controllers/hostel/HostelRoomController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.post("/", authenticate, createRoom);
router.put("/:id", authenticate, updateRoom);
router.delete("/:id", authenticate, deleteRoom);

export default router;
