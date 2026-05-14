import express from "express";
import { login, getMe, changePassword } from "../controllers/AuthController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/v1/auth/login - Login with email and password
router.post("/login", login);

// GET /api/v1/auth/me - Get current logged-in school info (Protected)
router.get("/me", authenticate, getMe);

// POST /api/v1/auth/change-password - Change password (Protected)
router.post("/change-password", authenticate, changePassword);

export default router;
