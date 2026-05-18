import {
  getDashboardStats,
  getMonthlyReport,
} from "../../controllers/dashboard/DashboardController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authenticate, getDashboardStats);
router.get("/monthly-report", authenticate, getMonthlyReport);

export default router;
