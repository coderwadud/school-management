import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  toggleRouteStatus,
} from "../../controllers/transport/TransportRouteController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.post("/", authenticate, createRoute);
router.put("/:id", authenticate, updateRoute);
router.delete("/:id", authenticate, deleteRoute);
router.patch("/:id/status", authenticate, toggleRouteStatus);

export default router;
