import { createSession, updateSession, getSessions, getSessionById, deleteSession, getSessionsOptions, toggleSessionStatus } from "../controllers/SessionController.js";
import express from "express";

const router = express.Router();

router.post("/", createSession);
router.get("/", getSessions);
router.get("/options", getSessionsOptions);
router.put("/:id", updateSession);
router.get("/:id", getSessionById);
router.delete("/:id", deleteSession);
router.patch("/:id/status", toggleSessionStatus);

export default router;
