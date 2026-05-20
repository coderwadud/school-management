import {
  generateReportCard,
  generateAdmitCard,
  generateTabulationSheet,
} from "../../controllers/utils/ReportCardController.js";
import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/report-card", authenticate, generateReportCard);
router.get("/admit-card", authenticate, generateAdmitCard);
router.get("/tabulation-sheet", authenticate, generateTabulationSheet);

export default router;
