import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../../controllers/transport/VehicleController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);
router.post("/", authenticate, createVehicle);
router.put("/:id", authenticate, updateVehicle);
router.delete("/:id", authenticate, deleteVehicle);

export default router;
