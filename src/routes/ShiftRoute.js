import { createShift, getShifts, getShiftById, updateShift, deleteShift, toggleShiftStatus, getShiftsOptions } from "../controllers/ShiftController.js";
import express from "express";

const router = express.Router();

router.post("/", createShift);
router.get("/", getShifts);
router.get("/options", getShiftsOptions);
router.get("/:id", getShiftById);
router.put("/:id", updateShift);
router.delete("/:id", deleteShift);
router.patch("/:id/status", toggleShiftStatus);

export default router;
