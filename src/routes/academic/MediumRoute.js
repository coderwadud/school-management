import { createMedium, getMediums, getMediumById, updateMedium, deleteMedium, toggleMediumStatus, getMediumsOptions } from "../../controllers/academic/MediumController.js";
import express from "express";

const router = express.Router();

router.post("/", createMedium);
router.get("/", getMediums);
router.get("/options", getMediumsOptions);
router.get("/:id", getMediumById);
router.put("/:id", updateMedium);
router.delete("/:id", deleteMedium);
router.patch("/:id/status", toggleMediumStatus);

export default router;
