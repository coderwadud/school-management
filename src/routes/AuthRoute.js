import express from "express";
import { register, login, refreshToken } from "../controllers/AuthController.js";

const router = express.Router();

// POST /api/v1/auth/register
router.post("/register", register);

// POST /api/v1/auth/login
router.post("/login", login);

// POST /api/v1/auth/refresh-token
router.post("/refresh-token", refreshToken);

export default router;
